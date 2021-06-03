import React, { useState, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GML32 from 'ol/format/GML32';
import { FullScreen, defaults as defaultControls } from 'ol/control';
import { DragRotateAndZoom, defaults as defaultInteractions } from 'ol/interaction';
import { Style } from 'ol/style';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { allEqual, groupBy } from 'utils/helpers';
import './GmlMap.scss';

const epsgRegex = /^(http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/|^urn:ogc:def:crs:EPSG::)(?<epsg>\d+)$/;

const namespaces = {
   'gml': 'http://www.opengis.net/gml/3.2',
   'app': 'http://skjema.geonorge.no/SOSI/produktspesifikasjon/Reguleringsplanforslag/5.0'
};

const nsResolver = (nsPrefix) => namespaces[nsPrefix] || null;

const getFeatureMembers = gmlDoc => {
   const result = gmlDoc.evaluate('//gml:featureMember/*', gmlDoc.documentElement, nsResolver, XPathResult.ANY_TYPE, null);
   const map = new window.Map();
   let feature;

   while ((feature = result.iterateNext()) !== null) {
      map.set(feature.getAttribute('gml:id'), feature.localName);
   }

   return map;
};

const getEpsgCode = gmlDoc => {
   const result = gmlDoc.evaluate('(//*[@srsName]/@srsName)[1]', gmlDoc.documentElement, nsResolver, XPathResult.STRING_TYPE, null);
   const srsName = result.stringValue;
   const match = epsgRegex.exec(srsName);

   return match !== null ? `EPSG:${match.groups['epsg']}` : null;
};

const enrichFeatures = (features, featureMembers) => {
   features.forEach(feature => {
      const id = feature.getId();
      const name = featureMembers.get(id);
      const label = name ? `${name} '${id}'` : id;

      feature.set('name', name);
      feature.set('label', label);
   });
};

const getFeatures = gmlDocuments => {
   return gmlDocuments.flatMap(gmlDoc => {
      const format = new GML32();
      const features = format.readFeatures(gmlDoc);
      const featureMembers = getFeatureMembers(gmlDoc);

      enrichFeatures(features, featureMembers);

      return features.filter(feature => feature.getGeometry() !== undefined);
   });
}

const createMap = (features, epsgCode) => {
   const source = new VectorSource({ features });
   const vectorLayer = new VectorLayer({ source });
   const tileLayer = new TileLayer({ source: new OSM(), visible: false });

   const map = new Map({
      target: 'map',
      controls: defaultControls().extend([new FullScreen()]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      layers: [
         tileLayer,
         vectorLayer
      ],
      view: new View({
         projection: epsgCode,
         padding: [25, 25, 25, 25]
      })
   });

   map.getView().fit(source.getExtent(), map.getSize());

   return map;
};

let map;

const GmlMap = ({ gmlDocuments, config }) => {
   const [groupedFeatures, setGroupedFeatures] = useState([]);

   useEffect(() => {
      if (!gmlDocuments.length) {
         return;
      }

      const epsgCodes = gmlDocuments.map(gmlDoc => getEpsgCode(gmlDoc))

      if (!allEqual(epsgCodes)) {
         return;
      }

      const features = getFeatures(gmlDocuments);
      setGroupedFeatures(groupBy(features, feature => feature.get('name')));

      if (map) {
         map.dispose();
      }

      map = createMap(features, epsgCodes[0]);

      return () => {
         map.dispose();
      };
   }, [gmlDocuments]);

   const handleFeatureTypeChecked = (event) => {
      const features = groupedFeatures[event.target.value];
      const checked = !event.target.checked;

      features.forEach(feature => {
         feature.setStyle(checked ? new Style({}) : null);
      });
   }

   const handleBaseMapToggle = _ => {
      const tileLayer = map.getLayers().getArray().find(layer => layer instanceof TileLayer)
      const visible = tileLayer.get('visible');
      tileLayer.setVisible(!visible);
   }

   if (!gmlDocuments.length) {
      return '';
   }

   return (
      <div className="map-container">
         <div id="map" className="map"></div>
         <div className="map-menu">
            <ul>
               <li>
                  <label className="checkbox">
                     Grunnkart
                     <input type="checkbox" onChange={handleBaseMapToggle} />
                     <span className="checkmark"></span>
                  </label>
               </li>
               {
                  Object.keys(groupedFeatures).map((key, index) => {
                     return (
                        <li key={index}>
                           <label className="checkbox">
                              {key} ({groupedFeatures[key].length})
                              <input type="checkbox" defaultChecked={true} value={key} onChange={handleFeatureTypeChecked} />
                              <span className="checkmark"></span>
                           </label>
                        </li>
                     );
                  })
               }
            </ul>
         </div>
      </div>
   );
};

export default GmlMap