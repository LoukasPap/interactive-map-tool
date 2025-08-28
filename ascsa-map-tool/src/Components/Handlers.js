export const handleDrawShape = (mapRef, shape) => {
  if (mapRef) {
    switch (shape) {
      case "Circle":
        mapRef.pm.enableDraw("Circle");
        break;

      case "Rectangle":
        mapRef.pm.enableDraw("Rectangle");
        break;

      case "Polygons":
        mapRef.pm.enableDraw("Polygon");
        break;

      default:
        console.log("handleDrawShape(mapRef, shape) - Enter default case - Shape:", shape);
        break;
    }
  }
};

export const handleEdit = (mapRef) => {
  if (mapRef) {
    mapRef.pm.enableGlobalEditMode();
  }
};

export const handleRemove = (mapRef) => {
  if (mapRef) {
    mapRef.pm.enableGlobalRemovalMode();
  }
};

export const handleEvent = (mapRef, event) => {
  switch (event) {
    case "Edit":
      console.log("Enable editing");
      mapRef.pm.enableGlobalEditMode();
      break;
      
      case "Remove":
      console.log("Enable removal");
      mapRef.pm.enableGlobalRemovalMode();
      break;

    default:
      console.log(`Event not handled: ${event}`);
  }
};

export const deactivateHandlers = (mapRef) => {
  if (mapRef) {
    mapRef.pm.disableDraw("Circle");
    mapRef.pm.disableDraw("Rectangle");
    mapRef.pm.disableDraw("Polygons");
    mapRef.pm.disableGlobalEditMode();
    mapRef.pm.disableGlobalRemovalMode();
  }
};
