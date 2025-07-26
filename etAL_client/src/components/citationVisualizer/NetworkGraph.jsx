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

function NetworkGraph({
  etAlData,
  selectedArticle,
  setSelectedArticle,
  setViewPortSize,
}) {
  const svgRef = useRef();

  //useEffect for initial rendering
  useEffect(() => {
    //Early escape for empty props
    if (etAlData.data === null) {
      return;
    }

    const centralArticleID = etAlData.sorted_citation_conversation[0].id;
    const derivedDimension =
      etAlData.sorted_citation_conversation[0].centrality_score;
    console.log(derivedDimension);
    const width = derivedDimension * 1.5;
    const height = derivedDimension * 1.5;

    setViewPortSize({ width: width, height: height });

    const [nodes, links] = nodeAndLinkMaker(etAlData);
    nodes.forEach((d) => {
      if (d.id === centralArticleID) {
        d.fx = width / 2;
        d.fy = height / 2;
      }
    });

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    //the + 1 transformation is necessary bc centrality score very likely includes 0s. Whenever the scales are called add + 1 to their check
    const correctedDomainValue = d3.extent(
      nodes,
      (d) => d.centrality_score + 1
    );

    //Create scaling values
    const valueScale = d3
      .scaleLog()
      .domain(correctedDomainValue)
      .range([derivedDimension, correctedDomainValue[0]]); //this range needs to be corrected

    const colorScale = d3
      .scaleSequentialLog(d3.interpolatePlasma)
      .domain(correctedDomainValue);

    const sizeScale = d3
      .scaleLog()
      .domain(correctedDomainValue)
      .range([10, 70]); //this is a "magic number" bc I decided that this range from 10 and 70 looks nice

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
          .distance(50) // these numbers should be rendered more dynamically
      )
      .force(
        "collide",
        d3.forceCollide().radius((d) => 10 + sizeScale(d.centrality_score + 1)) //radius is hard coded based on range above, could be rendered more dynamically
      )
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      .force(
        "radial",
        d3
          .forceRadial(
            (d) => valueScale(d.centrality_score + 1),
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
        setSelectedArticle({ id: targetID, o });
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
  useEffect(() => {}, [selectedArticle]);

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
    return <svg ref={svgRef} />;
  }
}

export default NetworkGraph;
