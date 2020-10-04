// create a player object for the given name and icon
function createPlayer(newName, newIcon, playerType) {
  let name = newName || "";
  let icon = newIcon || "";
  let type = playerType || "user";

  const getName = () => name;
  const getIcon = () => icon;
  const getType = () => type;
  const setName = (name) => (this.name = name);
  const setIcon = (icon) => (this.icon = icon);
  const setType = (type) => (this.type = type);

  return { getName, getIcon, getType, setName, setIcon, setType };
}

export default createPlayer;
