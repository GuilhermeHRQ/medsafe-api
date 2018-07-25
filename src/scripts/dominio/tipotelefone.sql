CREATE OR REPLACE FUNCTION administracao.selecionarTipoTelefone()
    RETURNS TABLE(
        "id"   INTEGER,
        "nome" VARCHAR(50)
    ) AS $$

/*
SELECT administracao.selecionarTipoTelefone()
  */

BEGIN
    RETURN QUERY
    SELECT
        tt.id,
        tt.nome
    FROM administracao.tipotelefone tt;
END;
$$
LANGUAGE PLPGSQL;