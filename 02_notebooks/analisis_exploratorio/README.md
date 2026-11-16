# ENDICEX · Análisis exploratorio de datos (EDA)

Este apartado contiene notebooks **complementarios** de exploración descriptiva. No forman parte de la secuencia obligatoria de reproducción del PCA y K-means documentada en [ENDICEX_PIPELINE.md](../../ENDICEX_PIPELINE.md).

## Notebook publicado

- [ENDICEX_EDA_4_Bloques_Colab.ipynb](ENDICEX_EDA_4_Bloques_Colab.ipynb): atlas exploratorio de los siete indicadores sociales y financieros, agrupado en cuatro bloques:
  1. **Sociales, análisis individual:** renta media por persona, Gini y pobreza total (111 entidades).
  2. **Sociales, comparación por estratos:** las mismas tres variables (111 entidades).
  3. **Financieros, análisis individual:** gasto municipal, gasto por habitante, endeudamiento por habitante e inversión por habitante (101 entidades con cuentas rendidas).
  4. **Financieros, comparación por estratos:** las mismas cuatro variables (101 entidades).

## Reproducción

1. Abre el notebook en Jupyter o Google Colab.
2. Utiliza el Excel [ENDICEX_111_Anonimo_END_HAB_Imputado.xlsx](../../01_datos/ENDICEX_111_Anonimo_END_HAB_Imputado.xlsx), disponible en la carpeta `01_datos/`.
3. Si ejecutas en Colab y el Excel no está presente, el notebook solicita cargarlo manualmente.
4. Ejecuta las celdas en orden; el notebook validará la muestra, la rendición de cuentas y las **8 imputaciones** de endeudamiento por habitante.
5. Los resultados se generan en `ENDICEX_EDA_4_BLOQUES_SALIDAS/`, organizados en `figuras/` y `tablas/`. El script final empaqueta los resultados y ofrece descargarlos desde Colab.

## Resultados previstos

- **14 fichas** gráficas individuales/estratificadas, cada una en PNG y SVG.
- **5 tablas CSV** de estadística descriptiva, estratos, valores atípicos IQR, trazabilidad de imputaciones y recuentos.
- **1 previsualización** de los cuatro bloques y un documento `LEEME.md` generado por el notebook.

La versión publicada del notebook conserva **código y celdas explicativas, sin salidas de ejecución incrustadas**, para limitar el tamaño del repositorio y evitar publicar previsualizaciones derivadas de una ejecución particular. Los resultados se regeneran al ejecutar el notebook.

**Confidencialidad y alcance:** no se muestran nombres de municipios en el notebook publicado. El código utiliza identificadores para validación y trazabilidad y puede generar CSV con identificadores y códigos INE de los datos de entrada; revisa esos archivos antes de difundir los resultados. Los gráficos y las tablas son descriptivos: no representan resultados de auditoría, inferencia causal ni una muestra representativa.

[Volver a notebooks](../) · [Volver al repositorio](../../)
