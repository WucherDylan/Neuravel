import { useState } from "react";
import Home from "./Home";
import Compare from "./Compare";
import Alcool from "./drugs/Alcool";
import Heroine from "./drugs/Heroine";
import Crack from "./drugs/Crack";
import Cocaine from "./drugs/Cocaine";
import Methamphetamine from "./drugs/Methamphetamine";
import Tabac from "./drugs/Tabac";
import Cannabis from "./drugs/Cannabis";
import Benzodiazepines from "./drugs/Benzodiazepines";
import Cathinones from "./drugs/Cathinones";
import Amphetamines from "./drugs/Amphetamines";
import Champignons from "./drugs/Champignons";
import LSD from "./drugs/LSD";

const DRUGS = {
  alcool: Alcool,
  heroine: Heroine,
  crack: Crack,
  cocaine: Cocaine,
  meth: Methamphetamine,
  tabac: Tabac,
  cannabis: Cannabis,
  benzos: Benzodiazepines,
  cathinones: Cathinones,
  amphetamines: Amphetamines,
  champignons: Champignons,
  lsd: LSD,
};

export default function App() {
  const [page, setPage] = useState(null);

  if (page === "compare") {
    return <Compare onBack={() => setPage(null)} />;
  }

  if (page && DRUGS[page]) {
    const DrugPage = DRUGS[page];
    return <DrugPage onBack={() => setPage(null)} />;
  }

  return <Home onSelect={setPage} onCompare={() => setPage("compare")} />;
}
