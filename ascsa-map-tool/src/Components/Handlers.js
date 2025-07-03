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
        console.log("handleDrawShape(mapRed, shape) - Enter default case");
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

export const deactivateHandlers = (mapRef) => {
  if (mapRef) {
    mapRef.pm.disableDraw("Circle");
    mapRef.pm.disableDraw("Rectangle");
    mapRef.pm.disableDraw("Polygons");
    mapRef.pm.disableGlobalEditMode();
    mapRef.pm.disableGlobalRemovalMode();
  }
};
