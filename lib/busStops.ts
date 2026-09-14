export type BusStop = {
  id: string;
  municipality: string;
  name: string;
  lat: number;
  lng: number;
};

// Same dataset used by the mobile app, so both apps show identical
// bus stop pins.
export const busStops: BusStop[] = [
  { id: "zamodca-olongapo-terminal", municipality: "Olongapo City", name: "Zamodca Olongapo Terminal", lat: 14.838879, lng: 120.28344 },
  { id: "subic-public-market", municipality: "Subic", name: "Subic Public Market", lat: 14.878507, lng: 120.234398 },
  { id: "subic-waltermart", municipality: "Subic", name: "Subic Waltermart", lat: 14.88846, lng: 120.237226 },
  { id: "castillejos-local-park", municipality: "Castillejos", name: "Castillejos Local Park", lat: 14.93229, lng: 120.200586 },
  { id: "san-marcelino-public-market", municipality: "San Marcelino", name: "San Marcelino Public Market", lat: 14.97371, lng: 120.155868 },
  { id: "san-antonio-municipal-hall", municipality: "San Antonio", name: "San Antonio Municipal Hall", lat: 14.948246, lng: 120.08972 },
  { id: "san-narciso-bus-stop", municipality: "San Narciso", name: "San Narciso Bus Stop", lat: 15.015925, lng: 120.079307 },
  { id: "san-felipe-public-market", municipality: "San Felipe", name: "San Felipe Public Market", lat: 15.060799, lng: 120.069908 },
  { id: "san-felipe-maloma", municipality: "San Felipe", name: "San Felipe, Maloma", lat: 15.11103, lng: 120.064008 },
  { id: "cabangan-municipal-hall", municipality: "Cabangan", name: "Cabangan Municipal Hall", lat: 15.159232, lng: 120.055168 },
  { id: "cabangan-santa-rita", municipality: "Cabangan", name: "Cabangan, Santa. Rita", lat: 15.179038, lng: 120.047248 },
  { id: "cabangan-panan", municipality: "Cabangan", name: "Cabangan, Panan", lat: 15.215753, lng: 120.025523 },
  { id: "botolan-porac", municipality: "Botolan", name: "Botolan, Porac", lat: 15.248517, lng: 120.019211 },
  { id: "botolan-municipal-hall", municipality: "Botolan", name: "Botolan Municipal Hall", lat: 15.28835, lng: 120.026484 },
  { id: "zamodca-iba-terminal", municipality: "Iba", name: "Zamodca Iba Terminal", lat: 15.3203357, lng: 119.9873523 },
  { id: "iba-town-center", municipality: "Iba", name: "Iba Town Center", lat: 15.328766, lng: 119.973593 },
  { id: "amungan-7-eleven", municipality: "Iba", name: "Amungan, 7-Eleven", lat: 15.364873, lng: 119.95751 },
  { id: "palauig-bulawen", municipality: "Palauig", name: "Palauig, Bulawen", lat: 15.41719, lng: 119.953236 },
  { id: "palauig-zambales", municipality: "Palauig", name: "Palauig, Zambales", lat: 15.452345, lng: 119.954764 },
  { id: "masinloc-municipal-hall", municipality: "Masinloc", name: "Masinloc Municipal Hall", lat: 15.532287, lng: 119.957898 },
  { id: "taltal-brgy-plaza-masinloc", municipality: "Masinloc", name: "Taltal Brgy. Plaza, Masinloc", lat: 15.581859, lng: 119.94801 },
  { id: "candelaria-district-hospital", municipality: "Candelaria", name: "Candelaria District Hospital", lat: 15.606962, lng: 119.937914 },
  { id: "candelaria-uacon-lake-plaza", municipality: "Candelaria", name: "Candelaria Uacon Lake & Plaza", lat: 15.674587, lng: 119.936772 },
  { id: "prmsu-sta-cruz", municipality: "Santa Cruz", name: "PRMSU Sta. Cruz", lat: 15.707472, lng: 119.917218 },
  { id: "sta-cruz-municipal-park", municipality: "Santa Cruz", name: "Sta. Cruz Municipal Park", lat: 15.762609, lng: 119.910708 },
  { id: "zamodca-santa-cruz-terminal", municipality: "Santa Cruz", name: "Zamodca Santa Cruz Terminal", lat: 15.773003, lng: 119.905279 },
];