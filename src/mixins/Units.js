const _ = require("lodash");

export default {
  data() {
    return {
      unitOptions: [
        {
          type: "length",
          unit: "meter",
          display: "m",
        },
        {
          type: "area",
          unit: "meter ** 2",
          display: "m²",
        },
        {
          type: "volume",
          unit: "meter ** 3",
          display: "m³",
        },
        {
          type: "time",
          unit: "second",
          display: "s",
        },
        {
          type: "angle",
          unit: "rad",
          display: "radians",
        },
        {
          type: "mass",
          unit: "kilogram",
          display: "kg",
        },
        {
          type: "temperature",
          unit: "kelvin",
          display: "K",
        },
        {
          type: "frequency",
          unit: "1 / second",
          display: `s<sup>-1</sup>`,
        },
        {
          type: "velocity",
          unit: "meter / second",
          display: "m/s",
        },
        {
          type: "acceleration",
          unit: "meter / second ** 2",
          display: "m/s²",
        },
        {
          type: "force",
          unit: "kilogram * meter / second ** 2",
          display: "N",
        },
        {
          type: "energy",
          unit: "kilogram * meter ** 2 / second ** 2",
          display: "J",
        },
        {
          type: "power",
          unit: "kilogram * meter ** 2 / second ** 3",
          display: "W",
        },
        {
          type: "momentum",
          unit: "meter * kilogram / second",
          display: `kg m s<sup>-1</sup>`,
        },
        {
          type: "density",
          unit: "kilogram / meter ** 3",
          display: "kg/m³",
        },
        {
          type: "pressure",
          unit: "kilogram / meter ** 2",
          display: "Pa",
        },
        {
          type: "electric potential",
          unit: "kilogram * meter ** 2 / ampere / second ** 3",
          display: "V",
        },
        {
          type: "current",
          unit: "ampere",
          display: "A",
        },
        {
          type: "count",
          unit: "dimensionless",
          display: "",
        },
        {
          type: "count",
          unit: "count",
          display: "",
        },
        {
          type: "count",
          unit: "percentage",
          display: "%",
        },
        {
          type: "sound intensity",
          unit: "decibel",
          display: "dB",
        },
      ],
    };
  },

  methods: {
    formatUnit(unit) {
      let u = _.find(this.unitOptions, { unit: unit });
      if (u) {
        return u.display;
      }
      return unit;
    },
  },
};
