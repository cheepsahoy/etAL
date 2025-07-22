import * as d3 from "d3";
import { useRef, useEffect } from "react";

function nodeAndLinkMaker(data) {
  const uniqueIDs = data.sorted_citation_conversation;
  const nodes = [];
  for (const id of uniqueIDs) {
    const template = { ...data[id] };
    nodes.push(template);
  }

  const links = [];
  for (const id of uniqueIDs) {
    const outgoingIDs = Object.keys(data[id].outgoing_cites_internal);
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
  const [nodes, links] = nodeAndLinkMaker(etAlData);
  const svgRef = useRef();
  const width = 3000;
  const height = 3000;

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const domainValue = d3.extent(nodes, (d) => d.centrality_score);
    if (domainValue[0] === 0) {
      domainValue[0]++;
    }

    const valueScale = d3
      .scaleLinear()
      .domain(domainValue)
      .range([domainValue[1] / 2, domainValue[0] - 1])
      .clamp(true);

    const colorScale = d3
      .scaleSequentialLog(d3.interpolatePlasma)
      .domain(domainValue);

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
        const rootedRadius = Math.sqrt(d.centrality_score) * 5;
        if (rootedRadius > 5) {
          return rootedRadius + 5;
        }
        return 5;
      })
      .attr("fill", (d) => colorScale(d.centrality_score));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .strength(0.1)
          .distance(50)
      )
      .force(
        "collide",
        d3.forceCollide().radius((d) => {
          const rootedRadius = Math.sqrt(d.centrality_score) * 5;
          if (rootedRadius > 5) {
            return rootedRadius + 10;
          }
          return 15;
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      .force(
        "radial",
        d3
          .forceRadial(
            (d) => valueScale(d.centrality_score),
            width / 2,
            height / 2
          )
          .strength(1)
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
  }, [nodes, links]);

  return (
    <div className="viewer">
      <svg ref={svgRef} />
    </div>
  );
}

export default NetworkGraph;
