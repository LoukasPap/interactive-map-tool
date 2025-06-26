export const handleDrawCircle = (mapRef) => {
  if (mapRef) {
    mapRef.pm.enableDraw("Circle");
  }
};

export const handleDrawRectangle = (mapRef) => {
  if (mapRef) {
    mapRef.pm.enableDraw("Rectangle");
  }
};

export const handleEdit = (mapRef) => {
  if (mapRef) {
    mapRef.pm.toggleGlobalEditMode();
  }
};

export const deactivateDraw = (mapRef) => {
  if (mapRef) {
    mapRef.pm.disableDraw("Circle");
    mapRef.pm.disableDraw("Rectangle");
  }
};
