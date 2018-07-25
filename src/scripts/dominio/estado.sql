CREATE OR REPLACE FUNCTION administracao.selecionarUf()
    RETURNS TABLE(
        "sigla" CHAR(2),
        "nome"  VARCHAR(30)
    ) AS $$
/*
SELECT administracao.selecionarUf()
*/
BEGIN
    RETURN QUERY
    SELECT
        uf.sigla,
        uf.nome
    FROM administracao.uf uf;
END;
$$
LANGUAGE PLPGSQL;