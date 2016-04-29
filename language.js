/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   language.js   (Language change functions)
   Version 1.0, 2016-03-21
*************************************************/


function switchToEnglish() {
  t = textsEn;
  initDisplayTexts();
  infoText.refresh(pNbr);
}


function switchToFinnish() {
  t = textsFi;
  initDisplayTexts();
  infoText.refresh(pNbr);
}


function switchToSwedish() {
  t = textsSe;
  initDisplayTexts();
  infoText.refresh(pNbr);
}
