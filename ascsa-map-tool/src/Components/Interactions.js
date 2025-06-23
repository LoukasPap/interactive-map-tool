import CoinIcon from "../assets/Icons/Markers/CoinIcon";
import JeweleryIcon from "../assets/Icons/Markers/JeweleryIcon";
import StatueIcon from "../assets/Icons/Markers/StatueIcon";

export const getIcon = (item) => {
  // Determine which icon to use based on properties
  if (item == "Terracotta") {
    return CoinIcon;
  } else if (item == "Pottery") {
    return StatueIcon;
  } else {
    return JeweleryIcon;
  }
};
