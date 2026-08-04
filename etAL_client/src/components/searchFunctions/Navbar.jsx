import SearchBar from "./SearchBar";
import { Box, Container } from "@mantine/core";

function Navbar() {
  return (
    <Box component="header" className="navBar" py="lg">
      <Container size="sm">
        <SearchBar />
      </Container>
    </Box>
  );
}
export default Navbar;
