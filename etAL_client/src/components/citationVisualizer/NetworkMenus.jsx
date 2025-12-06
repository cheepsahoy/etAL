import MenuInConversation from "./Etal-Menus/MenuInConversation";

function NetworkMenus() {
  return (
    <div
      className="dataViewers"
      style={{
        display: "flex",
        flexDirection: "row",
        flex: "1",
      }}
    >
      <MenuInConversation oracleMode={true} />
      <MenuInConversation oracleMode={false} />
    </div>
  );
}

export default NetworkMenus;
