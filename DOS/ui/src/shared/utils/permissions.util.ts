type Permissions = {
  C: "CREATE",
  R: "READ",
  U: "UPDATE",
  D: "DELETE",
  F: "FORBIDDEN",
};

type App = {
  ASEP: "",
  ASER: "",
  ASFP: "",
  ASFR: "",
  AUD: "",
  CYTP: "",
  CYTR: "",
  DEP: "",
  R52: "",
  R53: "",
  R54: "",
  R55: "",
  R56: "",
  R57: "",
  R58: "",
  R59: "",
  R60: "",
  R61: "",
  R62: "",
  R63: "",
  R64: "",
  SFPR: "",
  USR: "",
};

const sampleAuthorities: string = "ASEP=F|ASER=F|ASFP=F|ASFR=F|AUD=F|CYTP=F|CYTR=F|DEP=R,U|R52=R|R53=R|R54=R|R55=R|R56=R|R57=R|R58=R|R59=R|R60=R|R61=R|R62=R|R63=R|R64=R|SFPR=F|USR=F";

export function mapPermissions(authorities: string): { [x: string]: Set<string>; }[] {
  return authorities.split("|")
  .map(item => {
    const [key, value] = item.split("=");
    return {
      [key]: new Set(value.split(',')),
    };
  });
}