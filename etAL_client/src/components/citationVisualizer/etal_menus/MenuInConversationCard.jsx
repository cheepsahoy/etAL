import useNetworkGraphContext from "../../../hooks/useNetworkGraphContext";
import { Button, Group, Paper, Text } from "@mantine/core";
function lastNameExtractor(string) {
  const regex = /\b(\w+)$/;
  const match = string.match(regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

function finalAuthorName(authorArray) {
  const authorNames = [];
  if (authorArray.length > 3) {
    authorNames.push(lastNameExtractor(authorArray[0]));
    authorNames.push(" et al.");
  } else if (authorArray.length !== 1) {
    const finalNamePosition = authorArray.length - 1;
    for (let i = 0; i < authorArray.length; i++) {
      if (i === finalNamePosition) {
        authorNames.push("and ");
        authorNames.push(authorArray[i]);
      } else {
        authorNames.push(authorArray[i]);
        authorNames.push(", ");
      }
    }
  } else {
    authorNames.push(authorArray[0]);
  }
  const finalName = authorNames.join("");
  return finalName;
}

function MenuInConversationCard({ data }) {
  const { setArticle } = useNetworkGraphContext();

  if (data.data) {
    const uniqueID = "endResults";
    const payload = data.data;

    return (
      <Text id={uniqueID} ta="center" size="sm" c="dimmed" py="sm">
        {payload}
      </Text>
    );
  } else {
    const uniqueID = data.id;
    const citationCount = data.centrality_score;
    const title = data.title;
    const doi = data.doi;

    const authorArray = Object.keys(data.authors);
    const finalName = finalAuthorName(authorArray);

    function buttonHandler() {
      setArticle(uniqueID);
      return;
    }

    return (
      <Paper id={uniqueID} p="sm" radius="md" withBorder>
        <Text size="sm" mb="sm">
          {citationCount} articles, citing {title}, by {finalName}
        </Text>
        <Group gap="xs">
        <Button size="xs" variant="light" onClick={buttonHandler}>Locate in graph</Button>
        <Button
          size="xs"
          variant="subtle"
          onClick={() => {
            if (doi === "No DOI on record") {
              const googleSearch = "https://www.google.com/search?q=";
              const querryPath = encodeURI(title);
              const finalPath = googleSearch + querryPath;
              window.open(finalPath, "_blank");
            } else {
              window.open(doi, "_blank");
            }
          }}
        >
          Open article
        </Button>
        </Group>
      </Paper>
    );
  }
}

export default MenuInConversationCard;
