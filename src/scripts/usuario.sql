CREATE OR REPLACE FUNCTION Seguranca.inserirUsuario(
  pNome            VARCHAR,
  pSobrenome       VARCHAR,
  pEmail           VARCHAR,
  pCpf             CHAR,
  pCelular         CHAR,
  pDataNascimento  DATE,
  pIdTipoSanguineo INTEGER,
  pEndereco        json
) AS $$
DECLARE
  vIdEndereco INTEGER;
BEGIN
  INSERT INTO Seguranca.endereco (
    cep,
    logradouro,
    bairro,
    numero,
    uf,
    idcidade
  )
    SELECT
      e."cep",
      e."logradouro",
      e."bairro",
      e."numero",
      e."uf",
      e."idCidade"
    FROM json_to_recordset(pEndereco) AS e (
         "cep" CHAR, "logradouro" VARCHAR, "bairro" VARCHAR, "numero" SMALLINT, "uf" CHAR, "idCidade" INTEGER) returning id INTO vIdEndereco;

  INSERT INTO Seguranca.usuario (
    nome,
    sobrenome,
    email,
    cpf,
    celular,
    datanascimento,
    idendereco,
    idtiposanguineo
  )
  VALUES (

  )
END;
$$
language plpgsql;
