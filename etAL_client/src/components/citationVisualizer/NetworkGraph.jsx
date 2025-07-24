import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

function nodeAndLinkMaker(data) {
  const uniqueIDs = data.sorted_citation_conversation;
  const nodes = [];
  const links = [];
  for (const id of uniqueIDs) {
    nodes.push(id);

    const outgoingIDs = Object.keys(id.outgoing_cites_internal);
    for (const outgoingCite of outgoingIDs) {
      const template = {
        source: id,
        target: outgoingCite,
      };
      links.push(template);
    }
  }

  return [nodes, links];
}

function NetworkGraph({ etAlData }) {
  const svgRef = useRef();
  const wrappedRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 3000, height: 3000 });
  const width = 3000;
  const height = 3000;

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) {
        return;
      }
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    resizeObserver.observe(wrappedRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (etAlData.data === null) {
      return;
    }
    const centralArticleID = etAlData.sorted_citation_conversation[0].id;
    const [nodes, links] = nodeAndLinkMaker(etAlData);
    nodes.forEach((d) => {
      console.log(d);
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

    const valueScale = d3
      .scaleLog()
      .domain(correctedDomainValue)
      .range([width / 4, correctedDomainValue[0]]);

    const colorScale = d3
      .scaleSequentialLog(d3.interpolatePlasma)
      .domain(correctedDomainValue);

    const sizeScale = d3
      .scaleLog()
      .domain(correctedDomainValue)
      .range([10, 110]); //this is a "magic number" bc I decided that this range from 5 and 100 looks nice

    const link = svg
      .append("g")
      .attr("stroke", "#ccc")
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => {
        const value = sizeScale(d.centrality_score + 1);
        return value;
      })
      .attr("fill", (d) => colorScale(d.centrality_score + 1));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .strength(0.02)
          .distance(50)
      )
      .force(
        "collide",
        d3.forceCollide().radius((d) => 10 + sizeScale(d.centrality_score + 1))
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

  if (etAlData.data === null) {
    return (
      <div>
        <p>Waiting on selection...</p>
      </div>
    );
  } else {
    return (
      <div ref={wrappedRef} style={{ width: "100%", height: "100vh" }}>
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      </div>
    );
  }
}

export default NetworkGraph;
