import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";
import useNetworkGraphContext from "../../hooks/useNetworkGraphContext";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";

function CitationCard({ citationObj, setSearchResults }) {
  const { loadData } = useNetworkGraphContext();

  //Populating template for CitationCard
  const template = {};
  template.title = citationObj.title ?? "No primary title on record";
  template.doi = citationObj.doi ?? "No DOI on record";
  template.pubDate =
    citationObj.publication_date ?? "No publication date on record.";
  template.source =
    citationObj?.primary_location?.source?.display_name ??
    "No primary source on record";
  template.id = etALSearch._extractOpenAlexID(citationObj.id);
  template.author = "";
  template.citationsCount =
    citationObj.cited_by_count ?? "No citation data exists";

  for (const authorObj of citationObj.authorships) {
    template.author += `${authorObj.author.display_name}, `;
  }
  const fixedName = template.author.slice(0, -2);
  template.author = fixedName;

  //Creating clickHandler function
  function clickHandler() {
    setSearchResults({
      waiting: false,
      id: citationObj.title,
    });

    loadData(citationObj, (citationObj.cited_by_count / 200) * 1.5);
  }

  return (
    <Paper id={template.id} p="sm" radius="md" withBorder>
      <Stack gap={4}>
        <Title order={3} size="sm">{template.title}</Title>
        <Text size="xs" fs="italic" c="dimmed">
          {template.author}
        </Text>
        <Text size="xs" c="dimmed">
          {template.pubDate}, {template.source}, {template.doi}, cited by:{" "}
          {template.citationsCount}
        </Text>
        <Group justify="flex-end" mt="xs">
          <Button size="xs" variant="light" onClick={clickHandler}>
            Visualize article
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

export default CitationCard;
