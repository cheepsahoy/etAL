import * as d3 from "d3";
import { useRef, useEffect } from "react";

//
function nodeAndLinkMaker(data) {
  const uniqueIDs = data.sorted_citation_conversation;
  const nodes = [];
  const links = [];
  for (const id of uniqueIDs) {
    nodes.push(id);

    const outgoingIDs = Object.keys(id.outgoing_cites_internal);
    for (const outgoingCite of outgoingIDs) {
      const template = {
        source: id.id,
        target: outgoingCite,
      };
      links.push(template);
    }
  }

  return [nodes, links];
}

//calculate optimal size. premise is to use a 'rollingCircle' approach to imagine average size (this is a 'worst case scenario') thinking about the biggest canvas needed. most likely most circles will be size 10, not between 10 and 100.
function optimalSizeCalculator(nodes, buffer) {
  const sortedNodes = [...nodes].sort(
    (a, b) => b.centrality_score - a.centrality_score
  );
  const centralityScores = nodes.map((node) => node.centrality_score + 1);
  const centralityRange = d3.extent(centralityScores);
  const sizeScale = d3.scaleLog().domain(centralityRange).range([10, 100]); //this is a "magic number" bc I decided that this range from 10 and 100 looks nice

  function circlePacker(sortedCircles, ringBuffer) {
    //Establish the central node, it will be skipped in future calculations
    const radiusDictionary = {};
    const centralNode = sortedCircles[0];
    const centralRadius = sizeScale(centralNode.centrality_score + 1);
    radiusDictionary[centralNode.id] = 0;

    //Find first outer node
    const largestOuterCircle = sizeScale(sortedCircles[1].centrality_score + 1);
    let currentRing = [];

    let currentRadius = centralRadius + ringBuffer;
    let angleUsed = 0;

    //we want to go through the sortedCircles
    for (let i = 1; i < sortedCircles.length; i++) {
      const id = sortedCircles[i].id;
      const centrality_score = sortedCircles[i].centrality_score;
      const circleRadius = sizeScale(centrality_score + 1);
      const angle = 2 * Math.asin(circleRadius / currentRadius);

      //this checks if it "fits" the curent ring
      if (angleUsed + angle <= 2 * Math.PI) {
        currentRing.push(circleRadius);
        angleUsed += angle;
        radiusDictionary[id] = currentRadius;
      } else {
        //we are moving onto a new ring
        const biggestRadius = currentRing.reduce((a, b) => Math.max(a, b), 0);
        currentRadius += 2 * biggestRadius + ringBuffer;
        //we can't use 'angle' because it was calculated for the previous layer
        angleUsed = 2 * Math.asin(circleRadius / currentRadius);
        currentRing = [circleRadius];
        radiusDictionary[id] = currentRadius;
      }
    }

    return [radiusDictionary, currentRadius];
  }
  const [radiusDictionary, finalRadius] = circlePacker(sortedNodes, buffer);
  const dimensions = 2 * finalRadius;
  return {
    radiusDictionary: radiusDictionary,
    maxRadius: finalRadius,
    width: dimensions,
    height: dimensions,
  };
}

function NetworkGraph({ etAlData, selectedArticle, setSelectedArticle }) {
  const svgRef = useRef();
  const selectedArticleRef = useRef(selectedArticle);

  //useEffect for tracking selectedArticle outside of rendering
  useEffect(() => {
    selectedArticleRef.current = selectedArticle;
  }, [selectedArticle]);

  //useEffect for initial rendering
  useEffect(() => {
    //Early escape for empty props
    if (etAlData.data === null) {
      return;
    }

    const centralArticleID = etAlData.sorted_citation_conversation[0].id;
    const [nodes, links] = nodeAndLinkMaker(etAlData);

    const nodeBufferSize = 5;
    const smallestNode = 10;
    const largestNode = 100;

    const sizes = optimalSizeCalculator(nodes, nodeBufferSize);
    const width = sizes.width;
    const height = sizes.height;

    console.log("caluclating width and height:", width, height);

    nodes.forEach((d) => {
      if (d.id === centralArticleID) {
        d.fx = width / 2;
        d.fy = height / 2;
      }
    });

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width * 2} ${height * 2}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    //clear previous content on new render
    svg.selectAll("*").remove();

    //the + 1 transformation is necessary bc centrality score very likely includes 0s. Whenever the scales are called add + 1 to their check
    const correctedDomainValue = d3.extent(
      nodes,
      (d) => d.centrality_score + 1
    );

    const colorScale = d3
      .scaleSequentialLog(d3.interpolatePlasma)
      .domain(correctedDomainValue);

    const sizeScale = d3
      .scaleLog()
      .domain(correctedDomainValue)
      .range([smallestNode, largestNode]); //this is a "magic number" bc I decided that this range from 10 and 100 looks nice

    const link = svg
      .append("g")
      .selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", (d) => `link source-${d.source} target-${d.target}`);

    const node = svg
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => sizeScale(d.centrality_score + 1))
      .style("fill", (d) => colorScale(d.centrality_score + 1))
      .attr("class", (d) => `node node-${d.id}`);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .strength(0.02) //these numbers should be rendered more dynamically
          .distance(nodeBufferSize) // these numbers can be rendered more dynamically
      )
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => nodeBufferSize + sizeScale(d.centrality_score + 1)) //radius is hard coded based on range above, could be rendered more dynamically?
      )
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      .force(
        "radial",
        d3
          .forceRadial(
            (d) => sizes.radiusDictionary[d.id],
            width / 2,
            height / 2
          )
          .strength((d) => {
            const invertedStrength = 1 / (d.centrality_score + 1);
            return Math.min(1, invertedStrength);
          })
      );

    svg.on("click", (event) => {
      const clickTarget = event.target;
      if (clickTarget.matches(".node")) {
        const datum = d3.select(clickTarget).datum();
        const targetID = datum.id;
        const previousArticleID = selectedArticleRef.current.id;
        console.log(datum, datum.title);
        if (previousArticleID === targetID) {
          const newOracle = !selectedArticleRef.current.oracle;
          setSelectedArticle({
            id: targetID,
            oracle: newOracle,
          });
        } else {
          setSelectedArticle({ id: targetID, oracle: false });
        }
      }
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    return () => simulation.stop();
  }, [etAlData]);

  //update render
  useEffect(() => {
    const targetID = selectedArticle.id;
    const oracleStatus = selectedArticle.oracle;
    if (targetID === null) {
      return;
    }
    const graph = d3.select(svgRef.current);
    const citingObj = {};

    if (oracleStatus === true) {
      graph.selectAll(".link").classed("selectedLink", (d) => {
        if (d.source.id === targetID) {
          citingObj[d.target.id] = true;
          return true;
        } else {
          return false;
        }
      });

      graph
        .selectAll(".node")
        .classed("oracleNode", (d) => {
          if (d.id === targetID) {
            return true;
          } else {
            return false;
          }
        })
        .classed("citedNode", false)
        .classed("citerNode", (d) => {
          if (citingObj[d.id]) {
            return true;
          } else {
            return false;
          }
        });
    } else {
      graph.selectAll(".link").classed("selectedLink", (d) => {
        if (d.target.id === targetID) {
          citingObj[d.source.id] = true;
          return true;
        } else {
          return false;
        }
      });

      graph
        .selectAll(".node")
        .classed("oracleNode", false)
        .classed("citedNode", (d) => {
          if (d.id === targetID) {
            return true;
          } else {
            return false;
          }
        })
        .classed("citerNode", (d) => {
          if (citingObj[d.id]) {
            return true;
          } else {
            return false;
          }
        });
    }
  }, [selectedArticle]);

  if (etAlData.loading === true) {
    return (
      <div>
        <p>Loading your graph, please wait!</p>
      </div>
    );
  } else if (etAlData.data === null) {
    return (
      <div>
        <p>Waiting on selection...</p>
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: "100%",
          height: "800px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg
          ref={svgRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  }
}

export default NetworkGraph;
