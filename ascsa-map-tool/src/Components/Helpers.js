export function getSectionFilter(section) {
  if (
    section.SectionNumberLetter !== "" &&
    section.SectionNumberNumber !== ""
  ) {
    return "SectionNumber";
  } else if (section.SectionNumberLetter !== "") {
    return "SectionNumberLetter";
  } else {
    return "SectionNumberNumber";
  }
}

export function isSectionEmpty(section) {
  return section.SectionNumber === "" ? true : false;
}
