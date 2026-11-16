# ENDICEX · Atlas exploratorio · 4 bloques


## Índice
1. Indicadores sociales individuales · 3 fichas (111 entidades).
2. Indicadores sociales por estratos · 3 fichas (111 entidades).
3. Indicadores financieros individuales · 4 fichas (101 entidades).
4. Indicadores financieros por estratos · 4 fichas (101 entidades).


**Fuente:** `ENDICEX_111_Anonimo_END_HAB_Imputado.xlsx`, hojas `Muestra_111` y `Auditoria_END_HAB`.


**Estratos:** <5.000, 5.000–19.999, 20.000–99.999, 100.000 o más.

**Variables:** sociales renta_media_persona, gini, pobreza_total_60; financieras GASTO MUNICIPAL, GTO HAB, END HAB, INV POR HAB.

**Población:** solo clasificación por estratos, nunca indicador sustantivo.

**Trazabilidad:** 111 entidades; 101 con rendición 2024; 10 sin rendición. Ocho END HAB imputados mediante medianas; se marcan con triángulo en gráficos pertinentes. Los valores imputados no son observados.

**Salida:** 14 fichas de 4 paneles en PNG y SVG; 5 tablas CSV de descriptivos, extremos por estrato y auditoría. Se excluye el Excel de entrada para evitar duplicar datos; súbelo al ejecutar el notebook.

**Interpretación:** muestra exploratoria no representativa. No hay pruebas de correlación, inferencia causal, PCA ni K-means. Los extremos IQR solo son indicios para revisión estadística, no hallazgos de fiscalización.

**Gasto municipal:** se representa en eje logarítmico positivo debido a la gran amplitud de su distribución.

**Gráficos individuales:** histograma, boxplot con observaciones, ECDF y nube de puntos ordenada (no se usa la población en el eje).

**Gráficos por estrato:** boxplot con puntos, violin orientativo, ECDF por estrato y mediana con IQR.
