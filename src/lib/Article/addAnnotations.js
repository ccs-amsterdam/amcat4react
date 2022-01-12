import { List, Popup } from "semantic-ui-react";
import { getColor, getColorGradient } from "./colors";

/**
 * A rather complicated function, but what it does is take an array of annotations
 * (that can be in artice._annotations), and add span tags to show them.
 * The reasons it's so complicated is that these annotations can overlap, so they first
 * need to be merged together.
 * @param {*} article
 * @returns
 */
export default function addAnnotations(article) {
  if (!article._annotations) return article;
  const mergedAnnotations = mergeAnnotations(article, article._annotations);
  console.log(mergedAnnotations);
  for (let field of Object.keys(mergedAnnotations)) {
    if (Array.isArray(article[field])) {
      // due to rerendering, the annotations can be added twice
      // except they can't and shouldn't, so if it's an array (i.e. tokens already added) skip it
      continue;
    }
    const parts = [];
    const text = article[field];
    let offset = 0;
    for (let annotation of mergedAnnotations[field]) {
      // check if there was text between the start/last annotation and the new one, and add
      // this as unannotated text
      if (annotation.start > offset) {
        parts.push(text.slice(offset, annotation.start));
      }

      // then add the annotation span in a tags
      parts.push(annotateText(text.slice(annotation.start, annotation.end), annotation));

      offset = annotation.end;
    }
    // add final text after the last annotation
    parts.push(text.slice(offset));
    article[field] = parts;
  }
  return article;
}

const annotateText = (text, annotation) => {
  const annlist = [];
  const colors = [];
  for (let a of annotation.annotations) {
    const id = a.variable + "_" + a.value + "_" + a.start;
    const color = getColor(id, a.color);
    colors.push(color);
    annlist.push(
      <List.Item
        key={id}
        style={{
          backgroundColor: color,
          padding: "0.3em",
        }}
      >
        <b>{a.variable}</b>
        {": " + a.value}
      </List.Item>
    );
  }

  let cl = "annotated";
  if (annotation.left) cl += " left";
  if (annotation.right) cl += " right";

  return (
    <Popup
      basic
      hoverable={false}
      position="top left"
      style={{
        margin: "0.5em",
        padding: "0",
        border: "1px solid",
      }}
      trigger={
        <span
          className={cl}
          key={annotation.start + "_tag"}
          style={{ background: getColorGradient(colors) }}
        >
          {text}
        </span>
      }
    >
      <List>{annlist}</List>
    </Popup>
  );
};

const mergeAnnotations = (article, annotations) => {
  const annotationDict = {};
  console.log(annotations);
  for (let annotation of annotations) {
    if (!article[annotation.field]) continue;
    if (!annotationDict[annotation.field]) annotationDict[annotation.field] = {};
    for (let i = 0; i < annotation.length; i++) {
      if (!annotationDict[annotation.field][annotation.offset + i])
        annotationDict[annotation.field][annotation.offset + i] = [];
      annotationDict[annotation.field][annotation.offset + i].push(annotation);
    }
  }

  const mergedAnnotations = {};
  const writeAnnotation = (annotation, field, i) => {
    annotation.end = i;
    annotation.annotations = annotation.annotations.map((a) => ({
      variable: a.variable,
      value: a.value,
    }));
    annotation.right = annotationDict[field][i + 1] == null; // no annotation to right?
    mergedAnnotations[field].push(annotation);
  };

  for (let field of Object.keys(annotationDict)) {
    if (!mergedAnnotations[field]) mergedAnnotations[field] = [];
    let annotation = {};

    for (let i = 0; i <= article[field].length; i++) {
      // (<= so that it continues to just after the last char, for annotations all to the end)
      let newAnnotation = false;
      const positionAnnotations = annotationDict[field][i];

      if (!positionAnnotations) {
        // annotation ended
        if (!annotation.annotations) continue;
        writeAnnotation(annotation, field, i);
        annotation = {};
        continue;
      }

      if (!annotation.annotations) {
        // new annotation has not yet started, initializt it and continue
        annotation = { annotations: positionAnnotations, start: i, left: true };
        continue;
      }

      newAnnotation = annotationsAreDifferent(annotation.annotations, positionAnnotations);
      if (newAnnotation) {
        // annotation ended with the immediate start of a new annotation
        writeAnnotation(annotation, field, i);

        // if new annotation started, already add the starting position
        annotation = { annotations: positionAnnotations, start: i, left: false };
      }
    }
  }
  return mergedAnnotations;
};

const annotationsAreDifferent = (prev, next) => {
  if (prev.length !== next.length) return true;
  for (let j = 0; j < prev.length; j++) {
    if (next[j] !== prev[j]) {
      console.log(prev[j], next[j]);
      return true;
    }
  }
  return false;
};
