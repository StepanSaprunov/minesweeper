import { Field } from "./field.js";

const CELLSIZE = 25;

const width = document.querySelector("#field-width");
const height = document.querySelector("#field-height");
const canvas = document.querySelector("#field");
const difficult = document.querySelector("#field-mines");

width.addEventListener("change", ()=> new Field(canvas, width.value, height.value, difficult.value, CELLSIZE));
height.addEventListener("change", ()=> new Field(canvas, width.value, height.value, difficult.value, CELLSIZE));
difficult.addEventListener("change", ()=> new Field(canvas, width.value, height.value, difficult.value, CELLSIZE));


