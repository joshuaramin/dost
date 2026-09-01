type PersonalOrganics = {
  name: string;
  info: Array<PerosonalInfo>;
};

type PerosonalInfo = {
  name: string;
  position: string;
  url: string | undefined;
};

export const Personnel: PersonalOrganics[] = [
  {
    name: "Organics Personel",
    info: [
      {
        name: "Dr. Mideth B. Abisado, PhD",
        position: "Program Leader",
        url: "/assets/abisado.png",
      },
      {
        name: "Doc. Aldrin Salipande, PhD",
        position: "Project Leader",
        url: "/assets/salipande.jpg",
      },
      {
        name: "Doc. Vladimir Mariono, PhD",
        position: "Project Staff",
        url: "/assets/mariano.png",
      },
      {
        name: "Doc. Susan Saluya MSc",
        position: "Project Staff",
        url: "/assets/caluya.png",
      },
      {
        name: "Doc. Jemma Gonazales, MAEd",
        position: "Project Staff",
        url: "/assets/gonzales.png",
      },
      {
        name: "Santos, Carla Marie LPT, PhD",
        position: "Project Staff",
        url: "/assets/santos.png",
      },
      {
        name: "Ignacio, John Trixtan MSc",
        position: "Project Staff",
        url: "/assets/ignacio.png",
      },
      {
        name: "Guinto, Roel Jr. RMT, MSMT",
        position: "Project Staff",
        url: "/assets/guinto.png",
      },
    ],
  },
  {
    name: "Non-Organics Personel",
    info: [
      {
        name: "Sinapilo, Abdel Jalai",
        position: "Geospatial Data Scientist",
        url: "/assets/abdel.png",
      },
      {
        name: "Sinapilo, Abdel Jalai",
        position: "Senior Data Sciencetist",
        url: "/assets/abdel.png",
      },
      {
        name: "Rembulat, Joshua",
        position: "Project Technical Specialist ll (Web Developer)",
        url: "/assets/rembulat.png",
      },
      {
        name: "Blanco, Divine",
        position: "Project Technical Specialist ll (Mobile Developer)",
        url: "/assets/blanco.png",
      },
      {
        name: "Mendooza, John Gregorio",
        position: "Project Adminnistrator Assistant lll",
        url: "/assets/mendoza.jpg",
      },
      {
        name: "Grengia, Kenneth Franz",
        position: "Project Adminnistrator Aid V",
        url: "/assets/grengia.png",
      },
    ],
  },
];
