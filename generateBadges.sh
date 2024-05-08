#!/bin/bash

# Css linter badge generator
NB_CSS_ERR=$(grep "ERR" lintcss_report.txt | wc -l)
NB_CSS_WARN=$(grep "WARN" lintcss_report.txt | wc -l)
COLOR_CSS="green"

if [[ $NB_CSS_WARN -gt 0 ]]; then
    COLOR_CSS="orange"
fi

if [[ $NB_CSS_ERR -gt 0 ]]; then
    COLOR_CSS="red"
fi

if [[ $COLOR_CSS == "green" ]]; then
    anybadge -o -l "lint-css" -v 0 -c "$COLOR_CSS" -f "lintcss.svg"
else
    anybadge -o -l "lint-css" -v "$NB_CSS_ERR $NB_CSS_WARN" -c "$COLOR_CSS" -f "lintcss.svg"
fi


# Js linter badge generator
NB_JS_ERR=$(grep "[0-9]*:[0-9]* warning" lintes_report.txt | wc -l)
NB_JS_WARN=$(grep "[0-9]*:[0-9]* error" lintes_report.txt | wc -l)
COLOR_JS="green"

if [[ $NB_JS_WARN -gt 0 ]]; then
    COLOR_JS="orange"
fi

if [[ $NB_JS_ERR -gt 0 ]]; then
    COLOR_JS="red"
fi

if [[ $COLOR_JS == "green" ]]; then
    anybadge -o -l "lint-js" -v 0 -c "$COLOR_JS" -f "lintes.svg"
else
    anybadge -o -l "lint-js" -v "$NB_JS_ERR $NB_JS_WARN" -c "$COLOR_JS" -f "lintes.svg"
fi