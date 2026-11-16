# ENDICEX · Resultados del análisis exploratorio (EDA)

Este directorio conserva los resultados descriptivos derivados del notebook [ENDICEX_EDA_4_Bloques_Colab.ipynb](../../02_notebooks/analisis_exploratorio/ENDICEX_EDA_4_Bloques_Colab.ipynb), separado del pipeline principal de PCA y K-means.

## Contenido

- [figuras/](figuras/): **14 fichas** gráficas en formatos PNG y SVG (28 archivos) y una previsualización de los cuatro bloques. Las fichas corresponden a indicadores sociales y financieros, individuales y por estratos de población.
- [tablas/](tablas/): cuatro archivos CSV publicados con descriptivos globales, descriptivos por estrato, observaciones atípicas IQR y recuentos por estrato.
- [LEEME.md](LEEME.md): notas metodológicas generadas con el notebook.

Los resultados sociales abarcan 111 entidades; los financieros, 101 con cuentas rendidas en 2024. La muestra es exploratoria y no representativa. Los extremos estadísticos no constituyen resultados de auditoría.

## Confidencialidad y trazabilidad

La tabla de trazabilidad `04_trazabilidad_END_HAB.csv` **no se ha duplicado en estos resultados**, porque incluye códigos INE que identifican municipios y pueden permitir reidentificación. El archivo original sigue en [02_notebooks/analisis_exploratorio](../../02_notebooks/analisis_exploratorio/) y, mientras el repositorio sea público, también será accesible: es importante decidir expresamente si debe conservarse publicado o sustituirse por una versión anonimizada.

Las figuras y las tablas pueden contener identificadores seudonimizados y valores estadísticos. No se muestran nombres de municipios como etiquetas del repositorio; aun así, antes de cualquier difusión externa debe revisarse el riesgo de reidentificación por cruce de variables.

## Reproducibilidad

Se preservaron los nombres y el contenido original de los archivos trasladados. Para regenerarlos, ejecuta el notebook indicado y contrasta sus salidas con las fuentes disponibles en `01_datos/`.

[Volver a resultados](../) · [Volver al repositorio](../../)
