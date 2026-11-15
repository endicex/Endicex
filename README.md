# ENDICEX

### Ciencia de datos aplicada a la fiscalización de entidades locales

**ENDICEX** es un proyecto de investigación aplicada que explora cómo la integración de fuentes de datos y las técnicas de análisis multivariante pueden contribuir a identificar **perfiles diferenciados de entidades locales** y apoyar la **planificación de la fiscalización pública basada en riesgos**.

Su propósito es mostrar el potencial de las metodologías analíticas **transparentes, reproducibles y reutilizables** en el ámbito del control externo, sin sustituir los procedimientos profesionales y las garantías propias de una fiscalización.

> **Alcance:** investigación exploratoria. Los resultados no constituyen hallazgos de fiscalización ni valoraciones sobre la gestión de las entidades analizadas.

## 1. Objetivos

- Integrar información procedente de fuentes heterogéneas en una base de análisis común.
- Explorar las diferencias entre entidades desde una perspectiva multidimensional.
- Reducir la dimensionalidad de los indicadores mediante **análisis de componentes principales (PCA)**.
- Identificar grupos de entidades con características semejantes mediante **K-means**.
- Examinar el potencial de estos perfiles para orientar preguntas, prioridades y futuros procedimientos de fiscalización.
- Favorecer la **trazabilidad, validación y reutilización** de los análisis.

## 2. Alcance del estudio

| Elemento | Descripción |
|---|---|
| Universo de estudio | Entidades locales y ciudades autónomas seleccionadas para el ejercicio exploratorio |
| Muestra inicial | **111 entidades**: 109 ayuntamientos, Ceuta y Melilla |
| Cuentas de 2024 no rendidas en el momento del análisis | **10 entidades** |
| Entidades incorporadas al análisis multivariante | **101** |
| Reducción de dimensionalidad | **PCA, tres componentes** |
| Segmentación | **K-means, cinco conglomerados (K1–K5)** |
| Naturaleza de la muestra | **Exploratoria y no representativa** |

La selección de entidades no permite extrapolar automáticamente los resultados al conjunto de las entidades locales españolas.

## 3. Metodología

El análisis combina varias fases:

1. **Integración y preparación de datos.** Reunión de indicadores de distintas fuentes, comprobación de su coherencia y preparación para el análisis.
2. **Construcción y revisión de indicadores.** Tratamiento de dimensiones relacionadas, entre otras, con la vulnerabilidad socioeconómica, la situación financiera y la inversión.
3. **Análisis de componentes principales (PCA).** Obtención de tres componentes que permiten sintetizar y representar las relaciones entre las variables consideradas.
4. **Análisis de conglomerados (K-means).** Agrupación de las 101 entidades analizadas en cinco perfiles exploratorios, identificados como K1, K2, K3, K4 y K5.
5. **Interpretación y visualización.** Análisis comparado de perfiles y generación de tablas y gráficos para facilitar la lectura de los resultados.

Los componentes y conglomerados **no deben interpretarse como calificaciones de desempeño, incumplimiento o responsabilidad**. La descripción detallada de las variables, transformaciones y parámetros empleados debe contrastarse con los notebooks y archivos de resultados correspondientes.

## 4. Estructura del repositorio

```text
Endicex/
├── 01_datos/        # Datos y archivos de entrada del análisis
├── 02_notebooks/    # Cuadernos de trabajo y código de análisis
├── 03_resultados/   # Resultados y tablas generadas
├── 04_graficos/     # Figuras y visualizaciones
└── README.md        # Presentación y guía del proyecto
```

Puedes consultar directamente las carpetas de [datos](01_datos/), [notebooks](02_notebooks/), [resultados](03_resultados/) y [gráficos](04_graficos/).

## 5. Reproducción del análisis

El repositorio está organizado para facilitar la revisión de las bases de trabajo y de los resultados. Como punto de partida:

1. Clona o descarga el repositorio:

   ```bash
   git clone https://github.com/endicex/Endicex.git
   cd Endicex
   ```

2. Revisa los archivos de `01_datos/` para identificar las entradas utilizadas.
3. Abre los cuadernos de `02_notebooks/` en **JupyterLab**, **Jupyter Notebook** o un entorno compatible.
4. Comprueba las rutas de entrada y salida y ejecuta los cuadernos siguiendo sus dependencias y el orden que indique su propio código.
5. Contrasta las salidas con `03_resultados/` y `04_graficos/`.

**Estado de reproducibilidad:** la presencia de datos y notebooks no garantiza, por sí sola, una ejecución automática de principio a fin. Para una reproducción integral deben documentarse expresamente las versiones de las librerías, el orden de ejecución, los parámetros, las semillas aleatorias y el origen de cada conjunto de datos. Esta documentación se irá completando conforme se consolide el repositorio.

## 6. Interpretación y limitaciones

- **Exploración, no fiscalización:** la segmentación es una herramienta analítica y no implica juicios de legalidad, eficacia, eficiencia o economía.
- **Selección no representativa:** los resultados describen las entidades estudiadas y no deben generalizarse sin un diseño de investigación apropiado.
- **Dependencia de fuentes y periodos:** la comparabilidad de los indicadores está condicionada por su definición, disponibilidad y referencia temporal.
- **Sensibilidad metodológica:** los resultados de PCA y K-means dependen, entre otros factores, de las variables incorporadas, las transformaciones y los criterios de agrupación.
- **Validación profesional:** cualquier conclusión fiscalizadora requeriría evidencia suficiente y adecuada, procedimientos formales y la aplicación del marco normativo correspondiente.

## 7. Utilidad potencial para el control externo

ENDICEX busca contribuir al debate sobre el uso de la ciencia de datos en las instituciones de control externo, especialmente en la **identificación de patrones**, la **selección de áreas de atención** y el desarrollo de **capacidades analíticas compartidas y reutilizables**.

La integración de fuentes, la documentación de los modelos y la conservación de resultados verificables pueden favorecer la comparabilidad y reducir duplicidades en futuros ejercicios de análisis.

## 8. Autoría, fuentes y reutilización

Este repositorio forma parte del proyecto de investigación **ENDICEX**. Las referencias completas de autoría, las fuentes específicas de cada indicador y la cita bibliográfica del trabajo deberán incorporarse o enlazarse cuando estén disponibles en su versión definitiva.

**Licencia:** pendiente de definir. La disponibilidad pública del repositorio no implica, por sí sola, una autorización general de reutilización de todos sus contenidos o de los datos procedentes de terceros.

---

**ENDICEX · Ciencia de datos, reproducibilidad y fiscalización pública.**
