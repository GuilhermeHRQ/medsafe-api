CREATE OR REPLACE FUNCTION administracao.selecionarTipoSanguineo()
    RETURNS TABLE(
        "id"   INTEGER,
        "nome" CHAR(3)
    ) AS $$

/*
SELECT administracao.selecionarTipoSanguineo()
*/

BEGIN
    RETURN QUERY
    SELECT
        ts.id,
        ts.nome
    FROM administracao.tiposanguineo ts;
END;
$$
LANGUAGE PLPGSQL;