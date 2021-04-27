require("dotenv").config();
module.exports = {
  ANINDA_HAVALE: process.env.ANINDA_HAVALE,
  ANINDA_HAVALE_BCID: process.env.ANINDA_HAVALE_BCID,
  ANINDA_HAVALE_BCSUBID: process.env.ANINDA_HAVALE_BCSUBID,

  JET_PAPARA: process.env.JET_PAPARA,
  JET_PAPARA_BCID: process.env.JET_PAPARA_BCID,
  JET_PAPARA_BCSUBID: process.env.JET_PAPARA_BCSUBID,

  ANINDA_MEFETE: process.env.ANINDA_MEFETE,
  ANINDA_MEFETE_BCID: process.env.ANINDA_MEFETE_BCID,
  ANINDA_MEFETE_BCSUBID: process.env.ANINDA_MEFETE_BCSUBID,

  ANINDA_KREDI_KARTI: process.env.ANINDA_KREDI_KARTI,
  ANINDA_KREDI_KARTI_BCID: process.env.ANINDA_KREDI_KARTI_BCID,
  ANINDA_KREDI_KARTI_BCSUBID: process.env.ANINDA_KREDI_KARTI_BCSUBID,

  whitelist: [
    process.env.IP_1,
    process.env.IP_2,
    process.env.IP_3,
    process.env.IP_4,
    process.env.IP_5,
    process.env.IP_6,
    process.env.IP_7,
    process.env.IP_8,
    process.env.IP_9,
    process.env.IP_10,
    process.env.IP_11,
  ],
};
