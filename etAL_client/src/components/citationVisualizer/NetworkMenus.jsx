import MenuInConversation from "./etal_menus/MenuInConversation";
import { PanelRightOpen } from "lucide-react";
import { Affix, Button, Drawer, Tabs, Text, Title } from "@mantine/core";
import { useState } from "react";

function NetworkMenus() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Affix position={{ bottom: 20, right: 20 }} zIndex={10}>
        <Button
          radius="xl"
          variant="light"
          leftSection={<PanelRightOpen size={18} aria-hidden="true" />}
          aria-label="Open conversation citations"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          Citations
        </Button>
      </Affix>

      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
        size="md"
        padding="lg"
        title={
          <div>
            <Text c="milkyPurple.4" fw={700} size="xs" tt="uppercase">
              Explore
            </Text>
            <Title order={2} size="h4">
              Conversation citations
            </Title>
          </div>
        }
        overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
      >
        <Tabs defaultValue="oracle" keepMounted={false}>
          <Tabs.List grow mb="md">
            <Tabs.Tab value="oracle">Oracle</Tabs.Tab>
            <Tabs.Tab value="internal">Internal</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="oracle">
            <MenuInConversation oracleMode={true} />
          </Tabs.Panel>
          <Tabs.Panel value="internal">
            <MenuInConversation oracleMode={false} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>
    </>
  );
}

export default NetworkMenus;
