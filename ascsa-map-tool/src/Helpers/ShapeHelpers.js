export function getShapeProperties(shapeType, obj) {
  const layer = obj.layer || obj;

  let props = {
    type: shapeType,
    geojson: layer.toGeoJSON(),
    options: { pane: "overlayPane" },
  };

  if (shapeType == "Circle") {
    props.options.radius = layer.getRadius();
  }

  return props;
}

export function restoreShape(shapeData) {
  if (!shapeData || !shapeData.type) return null;

  const { type, geojson, options } = shapeData;

  let layer = null;

  switch (type) {
    case "Circle": {
      const [lng, lat] = geojson.geometry.coordinates;
      const radius = options?.radius ?? 0;
      layer = L.circle([lat, lng], { ...options, radius });
      break;
    }

    case "Rectangle": {
      layer = L.rectangle(
        geojson.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]),
        options
      );
      break;
    }

    case "Polygon": {
      layer = L.polygon(
        geojson.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]),
        options
      );
      break;
    }

    default:
      console.warn("Unknown shape type:", type);
  }

  if (layer && layer.pm) {
    layer.pm.enable({
      allowEditing: true,
      draggable: true,
      snappable: false,
    });
  }

  return layer;
}

export function removeShapeLayer(c) {
  if (c.shape.layer) {
    c.shape.layer.remove();
  } else {
    c.shape.remove();
  }
}
