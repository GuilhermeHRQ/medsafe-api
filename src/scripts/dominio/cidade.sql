CREATE OR REPLACE FUNCTION administracao.selecionarCidade(
    pUf     CHAR(2),
    pNome   VARCHAR(70),
    pLinha  INTEGER,
    pPagina INTEGER
)
    RETURNS TABLE(
        "id"   INTEGER,
        "nome" VARCHAR(70)
    ) AS $$
/*
SELECT administracao.selecionarCidade(
           null,
           null,
           10,
           1
       )
*/
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.nome
    FROM administracao.cidade c
    WHERE
        CASE WHEN pUf IS NOT NULL
            THEN c.uf = pUf
        ELSE
            TRUE
        END
        AND
        CASE WHEN pNome IS NOT NULL
            THEN c.nome ILIKE '%' || pNome || '%'
        ELSE
            TRUE
        END
    ORDER BY c.nome
    LIMIT CASE WHEN pLinha > 0 AND pPagina > 0
        THEN
            pLinha
          ELSE
              NULL
          END
    OFFSET CASE WHEN pLinha > 0 AND pPagina > 0
        THEN
            (pPagina - 1) * pLinha
           ELSE
               NULL
           END;
END;
$$
LANGUAGE PLPGSQL;