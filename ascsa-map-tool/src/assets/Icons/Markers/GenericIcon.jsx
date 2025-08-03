const GenericIcon = (fp) => {

  return L.icon({
    iconUrl: fp,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

export default GenericIcon;