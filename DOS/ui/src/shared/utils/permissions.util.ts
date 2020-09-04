type Permissions = {
  C: "CREATE",
  R: "READ",
  U: "UPDATE",
  D: "DELETE",
  F: "FULL ACCESS",
};

type App = {
  ASEP: "ASENL Preliminar",
  ASER: "ASENL Resultados",
  ASFP: "ASF Peliminar",
  ASFR: "ASF Resultados",
  AUD: "Auditorías",
  CYTP: "CyTG Preliminar",
  CYTR: "CyTG Resultados",
// DEP: "Dependencias", //catálogo
  R52: "Reporte 52",
  R53: "Reporte 53",
  R54: "Reporte 54",
  R55: "Reporte 55",
  R56: "Reporte 56",
  R57: "Reporte 57",
  R58: "Reporte 58",
  R59: "Reporte 59",
  R60: "Reporte 60",
  R61: "Reporte 61",
  R62: "Reporte 62",
  R63: "Reporte 63",
  R64: "Reporte 64",
  SFPR: "SFP",
  USR: "Usuarios",
};

// const sampleAuthorities: string = "ASEP=F|ASER=F|ASFP=F|ASFR=F|AUD=F|CYTP=F|CYTR=F|DEP=R,U|R52=R|R53=R|R54=R|R55=R|R56=R|R57=R|R58=R|R59=R|R60=R|R61=R|R62=R|R63=R|R64=R|SFPR=F|USR=F";

function mapPermissions(authorities: string): Map<string, Set<string>> {
  const permissionsMap = new Map();
  authorities
    .split("|")
    .forEach(item => {
      const [key, value] = item.split("=");
      permissionsMap.set(key, new Set(value.split(',')))
    });
  return permissionsMap;
}

export function resolvePermission(authorities: string, app: string, permission?: string): boolean {
  if (!authorities) {
    return false;
  }

  const permissions: Map<string, Set<string>> = mapPermissions(authorities);
  if (!app) {
    return false; // throw new Error('App input required to resolve permissions.');
  } else if (app && !permission) {
    return permissions.has(app);
  } else if (app && permission) {
    return Boolean(permissions.has(app) && permissions.get(app)?.has(permission));
  }
  return false;
}