const namespaces = {
   'gml': 'http://www.opengis.net/gml/3.2',
   'app': 'http://skjema.geonorge.no/SOSI/produktspesifikasjon/Reguleringsplanforslag/5.0'
};

const validationRuleIds = [
   'rpf.xsd.k.1', 
   'gml.epsg.1'
];

const featureMembers = {
   'Arealplan': {
   },
   'RpAngittHensynSone': {
   },
   'RpArealformålOmråde': {
   },
   'RpBestemmelseMidlByggAnlegg': {
   },
   'RpBestemmelseOmråde': {
   },
   'RpBestemmelseRom': {
   },
   'RpBåndleggingSone': {
   },
   'RpDetaljeringSone': {
   },
   'RpFareSone': {
   },
   'RpFormålGrense': {
   },
   'RpGjennomføringSone': {
   },
   'RpGrense': {
   },
   'RpHandlingOmråde': {
   },
   'RpHandlingRom': {
   },
   'RpHensynRom': {
   },
   'RpInfrastrukturSone': {
   },
   'RpJuridiskLinje': {
   },
   'RpJuridiskPunkt': {
   },
   'RpOmråde': {
   },
   'RpPåskrift': {
   },
   'RpRegulertHøyde': {
   },
   'RpRegulertTerreng': {
   },
   'RpSikringSone': {
   },
   'RpStøySone': {
   }
}

const config = {
   namespaces,
   validationRuleIds,
   featureMembers
}

export default config