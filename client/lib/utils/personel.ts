type PersonalOrganics = {
  name: string;
  info: Array<PerosonalInfo>;
};

type PerosonalInfo = {
  name: string;
  position: string;
  url?: string;
};

export const Personnel: PersonalOrganics[] = [
  {
    name: "Organics Personel",
    info: [
      {
        name: "Dr. Mideth B. Abisado",
        position: "Program Leader",
        url: "",
      },
      {
        name: "Doc. Salipande, Aldrin PhD",
        position: "Project Leader",
        url: "",
      },
      {
        name: "Mariano, Vladimir, PhD",
        position: "Project Staff",
        url: "",
      },
      {
        name: "Calayu, Susan MSc",
        position: "Project Staff",
        url: "",
      },

      {
        name: "Gonzales, Jemma MAEd",
        position: "Project Staff",
        url: "",
      },
      {
        name: "Santos, Carla Marie LPT, PhD",
        position: "Project Staff",
        url: "",
      },
      {
        name: "Ignacio, John Trixtan MSc",
        position: "Project Staff",
        url: "",
      },
      {
        name: "Guinto, Roel Jr. RMT, MSMT",
        position: "Project Staff",
        url: "",
      },
    ],
  },
  {
    name: "Non-Organics Personel",
    info: [
      {
        name: "Rembulat, Joshua",
        position: "Project Technical Specialist ll (Web Developer)",
        url: "",
      },
      {
        name: "Blanco, Divine",
        position: "Project Technical Specialist ll (Mobile Developer)",
        url: "",
      },
      {
        name: "Mendooza, John Gregorio",
        position: "Project Adminnistrator Assistant lll",
        url: "",
      },
      {
        name: "Grengia, Kenneth Franz",
        position: "Project Adminnistrator Aid V",
        url: "",
      },
    ],
  },
];
