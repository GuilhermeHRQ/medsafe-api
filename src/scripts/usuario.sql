CREATE OR REPLACE FUNCTION Seguranca.InserirUsuario(
    pNome            VARCHAR,
    pSobrenome       VARCHAR,
    pEmail           VARCHAR,
    pCpf             CHAR,
    pDataNascimento  DATE,
    pIdTipoSanguineo INTEGER,
    pSenha           VARCHAR,
    pLogon           VARCHAR,
    pEndereco        JSON,
    pTelefone        JSON
)
    RETURNS JSON AS $$

/*
SELECT * FROM Seguranca.inserirUsuario(
           'Guilherme',
           'Henrique',
           'b@email.com',
           '11111111111',
           '12-02-1999',
           '1',
           'teste123',
           'jamal',
           '{
             "cep": "14409015",
             "logradouro": "Rua Martiminiano Francisco de Andrade",
             "bairro": "Santa Adélia",
             "numero": 2245,
             "uf": "SP",
             "idCidade": 1
           }' :: JSON,
           '[
               {
                "numero": "16992417882",
                "idTipo": 1
               },
               {
                "numero": "1637034409",
                "idTipo": 2
               }
           ]'
       )
*/
DECLARE
    vIdEndereco INTEGER;
    vIdUsuario  INTEGER;
BEGIN
    IF EXISTS(SELECT 1
              FROM Seguranca.usuario u
              WHERE u.email = pEmail)
    THEN
        RETURN json_build_object(
                'executionCode', 1,
                'message', 'Email já cadastrado'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Seguranca.usuario u
              WHERE u.cpf = pCpf)
    THEN
        RETURN json_build_object(
                'executionCode', 2,
                'message', 'CPF já cadastrado'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Seguranca.usuario u
              WHERE u.logon = pLogon)
    THEN
        RETURN json_build_object(
                'executionCode', 3,
                'message', 'Logon já está sendo utilizado'
        );
    END IF;

    INSERT INTO Seguranca.endereco (
        cep,
        logradouro,
        bairro,
        numero,
        idcidade
    )
        SELECT
            e."cep",
            e."logradouro",
            e."bairro",
            e."numero",
            e."idCidade"
        FROM json_to_record(pEndereco)
            AS e(
             "cep" CHAR(8),
             "logradouro" VARCHAR(70),
             "bairro" VARCHAR(50),
             "numero" SMALLINT,
             "idCidade" INTEGER
             )
    RETURNING id
        INTO vIdEndereco;

    INSERT INTO Seguranca.usuario (
        nome,
        sobrenome,
        email,
        cpf,
        datanascimento,
        idendereco,
        idtiposanguineo,
        senha,
        logon
    )
    VALUES (
        pNome,
        pSobrenome,
        pEmail,
        pCpf,
        pDataNascimento,
        vIdEndereco,
        pIdTipoSanguineo,
        md5(pSenha),
        pLogon
    )
    RETURNING id
        INTO vIdUsuario;

    INSERT INTO Seguranca.telefone (
        idusuario,
        numero,
        idtipo
    )
        SELECT
            vIdUsuario,
            tel."numero",
            tel."idTipo"
        FROM json_to_recordset(pTelefone)
            AS tel (
             "numero" CHAR(11),
             "idTipo" INTEGER
             );

    RETURN json_build_object(
            'message', 'Usuário inserido com sucesso',
            'content', json_build_object(
                    'id', vIdUsuario
            )
    );
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION Seguranca.SelecionarUsuario(
    pFiltro VARCHAR(200),
    pLinhas INTEGER,
    pPagina INTEGER
)
    RETURNS TABLE(
        "totalLinhas" BIGINT,
        "id"          INTEGER,
        "nome"        VARCHAR(50),
        "sobrenome"   VARCHAR(50),
        "email"       VARCHAR(255)
    ) AS $$

/*
SELECT * FROM Seguranca.selecionarUsuario(
           '',
           10,
           1
       )
       */
BEGIN
    RETURN QUERY
    SELECT
        COUNT(1)
        OVER (
            PARTITION BY 1 ),
        u.id,
        u.nome,
        u.sobrenome,
        u.email
    FROM Seguranca.usuario u
    WHERE
        CASE WHEN pFiltro IS NOT NULL
            THEN u.nome ILIKE '%' || pFiltro || '%' OR u.sobrenome ILIKE '%' || pFiltro || '%'
        ELSE
            TRUE
        END
    LIMIT
        CASE WHEN pLinhas > 0 AND pPagina > 0
            THEN pLinhas
        ELSE
            NULL
        END
    OFFSET
        CASE WHEN pLinhas > 0 AND pPagina > 0
            THEN (pPagina - 1) * pLinhas
        ELSE
            NULL
        END;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION Seguranca.SelecionarUsuarioPorId(
    pId INTEGER
)
    RETURNS TABLE(
        "id"              INTEGER,
        "nome"            VARCHAR(50),
        "sobrenome"       VARCHAR(50),
        "email"           VARCHAR(255),
        "cpf"             CHAR(11),
        "dataNascimento"  DATE,
        "idTipoSanguineo" INTEGER,
        "ativo"           BOOLEAN,
        "logon"           VARCHAR(30),
        "endereco"        JSON,
        "telefones"       JSON
    ) AS $$

/*
  SELECT * FROM Seguranca.selecionarUsuarioPorId(3)
*/

BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.nome,
        u.sobrenome,
        u.email,
        u.cpf,
        u.datanascimento,
        u.idtiposanguineo,
        u.ativo,
        u.logon,
        (
            SELECT COALESCE(json_agg(ende), '{}')
            FROM (
                     SELECT
                         ue.id         AS "id",
                         ue.cep        AS "cep",
                         ue.logradouro AS "logradouro",
                         ue.bairro     AS "bairro",
                         ue.numero     AS "numero",
                         ue.idcidade   AS "idCidade"
                     FROM Seguranca.endereco ue
                     WHERE ue.id = u.idendereco
                 ) ende
        ) AS "endereco",
        (
            SELECT COALESCE(json_agg(tel), '[]')
            FROM (
                     SELECT
                         ut.id     AS "id",
                         ut.numero AS "numero",
                         ut.idtipo AS "idTipo"
                     FROM Seguranca.telefone as ut
                     WHERE ut.idusuario = pId
                 ) tel
        ) AS "telefones"
    FROM
        Seguranca.usuario u
    WHERE pId = u.id;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION Seguranca.AtualizarUsuario(
    pIdUsuario       INTEGER,
    pNome            VARCHAR(50),
    pSobrenome       VARCHAR(50),
    pEmail           VARCHAR(255),
    pCpf             CHAR(11),
    pDataNascimento  DATE,
    pIdTipoSanguineo INTEGER,
    pAtivo           BOOLEAN,
    pSenha           VARCHAR(100),
    pLogon           VARCHAR(30),
    pEndereco        JSON,
    pTelefone        JSON
)
    RETURNS JSON AS $$

/*
SELECT * FROM Seguranca.atualizarUsuario(
           3,
           'Robson Paes',
           'Tronquito',
           'b@email.com',
           '32112332101',
           '02-12-2000',
           '2',
           true,
           null,
           'jamal',
           '{
             "id": 3,
             "cep": "14409013",
             "logradouro": "Rua Azira Nassif",
             "bairro": "Jdm. Barão",
             "numero": 50,
             "uf": "SP",
             "idCidade": 1
           }' :: JSON,
           '[
             {
               "id": 11,
               "numero": "1637034402",
               "idTipo": 2
             },
             {
               "id": 12,
               "numero": "16992523350",
               "idTipo": 1
             }
           ]'
       )

*/
BEGIN
    IF NOT EXISTS(SELECT 1
                  FROM Seguranca.usuario u
                  WHERE u.id = pIdUsuario)
    THEN
        RETURN
        json_build_object(
                'executionCode', 1,
                'message', 'Usuário não encontrado'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Seguranca.usuario u
              WHERE u.email = pEmail AND u.id <> pIdUsuario)
    THEN
        RETURN json_build_object(
                'executionCode', 2,
                'message', 'Email já cadastrado'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Seguranca.usuario u
              WHERE u.cpf = pCpf AND u.id <> pIdUsuario)
    THEN
        RETURN json_build_object(
                'executionCode', 3,
                'message', 'CPF já cadastrado'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Seguranca.usuario u
              WHERE u.logon = pLogon AND u.id <> pIdUsuario)
    THEN
        RETURN json_build_object(
                'executionCode', 4,
                'message', 'Logon já cadastrado'
        );
    END IF;

    UPDATE Seguranca.usuario u
    SET nome            = pNome,
        sobrenome       = pSobrenome,
        email           = pEmail,
        cpf             = pCpf,
        datanascimento  = pDataNascimento,
        idtiposanguineo = pIdTipoSanguineo,
        ativo           = pAtivo,
        senha           = (
            CASE WHEN pSenha IS NOT NULL
                THEN md5(pSenha)
            ELSE senha END
        ),
        logon           = pLogon
    WHERE id = pIdUsuario;

    UPDATE Seguranca.endereco ue
    SET id         = ende."id",
        cep        = ende."cep",
        logradouro = ende."logradouro",
        bairro     = ende."bairro",
        numero     = ende."numero",
        idcidade   = ende."idCidade"
    FROM (
             SELECT
                 "id",
                 "cep",
                 "logradouro",
                 "bairro",
                 "numero",
                 "idCidade"
             FROM json_to_record(pEndereco)
                 AS x(
                  "id" INTEGER,
                  "cep" CHAR(8),
                  "logradouro" VARCHAR(70),
                  "bairro" VARCHAR(50),
                  "numero" SMALLINT,
                  "idCidade" INTEGER
                  )
         ) ende
    WHERE ue.id = ende."id";

    -- DELETA DO BANCO OS TELEFONES QUE NÃO FOREM RETORNADOS DO FRONT
    DELETE FROM Seguranca.telefone
    WHERE idusuario = pIdUsuario
          AND id NOT IN (SELECT id
                         FROM json_to_recordset(pTelefone)
                             AS x(
                              "id" INTEGER
                              )
                         WHERE id IS NOT NULL);

    -- UPDATE NO BANCO DOS TELEFONES QUE FOREM RETORNADOS DO FRONT
    UPDATE Seguranca.telefone ut
    SET numero = te."numero",
        idtipo = te."idTipo"
    FROM (
             SELECT
                 "id",
                 "numero",
                 "idTipo"
             FROM json_to_recordset(pTelefone)
                 AS x(
                  "id" INTEGER,
                  "numero" CHAR(11),
                  "idTipo" INTEGER
                  )
             WHERE id IS NOT NULL
         ) te
    WHERE ut.idusuario = pIdUsuario AND ut.id = te."id";

    -- INSERE NO BANCO ONDE O JSON NÃO TEM ID
    INSERT INTO Seguranca.telefone (
        idusuario,
        numero,
        idtipo
    )
        SELECT
            pIdUsuario,
            "numero",
            "idTipo"
        FROM json_to_recordset(pTelefone)
            AS x(
             "id" INTEGER,
             "numero" CHAR(11),
             "idTipo" INTEGER
             )
        WHERE id IS NULL;


    RETURN json_build_object(
            'message', 'Usuário atualizado com sucesso'
    );
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION Seguranca.RemoverUsuario(
    pId INTEGER
)
    RETURNS JSON AS $$

/*
SELECT * FROM Seguranca.removerUsuario(2)
*/

DECLARE
    vIdEndereco INTEGER;
BEGIN
    IF NOT EXISTS(SELECT 1
                  FROM Seguranca.usuario u
                  WHERE u.id = pId)
    THEN
        RETURN json_build_object(
                'executionCode', 1,
                'message', 'Usuário não encontrado'
        );
    END IF;

    DELETE FROM Seguranca.telefone
    WHERE idusuario = pId;

    DELETE FROM Seguranca.usuario u
    WHERE u.id = pId
    RETURNING idendereco
        INTO vIdEndereco;

    DELETE FROM Seguranca.endereco ue
    WHERE ue.id = vIdEndereco;

    RETURN json_build_object(
            'message', 'Usuário excluído com sucesso'
    );
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION Seguranca.LoginUsuario(
    pLogin VARCHAR,
    pSenha VARCHAR
)
    RETURNS TABLE(
        "id"           INTEGER,
        "nome"         VARCHAR(50),
        "sobrenome"    VARCHAR(50),
        "email"        VARCHAR(255),
        "logon"        VARCHAR(30),
        "ativo"        BOOLEAN,
        "senhaCorreta" BOOLEAN
    ) AS $$

/*
SELECT * FROM Seguranca.loginUsuario(
    'a@email.com',
    ''
);
*/

BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.nome,
        u.sobrenome,
        u.email,
        u.logon,
        u.ativo,
        (md5(pSenha) = u.senha)
    FROM Seguranca.usuario u
    WHERE u.logon = pLogin OR u.email = pLogin;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION Seguranca.RefazLogin(
    pId INTEGER
)
    RETURNS TABLE(
        "id"        INTEGER,
        "nome"      VARCHAR(50),
        "sobrenome" VARCHAR(50),
        "email"     VARCHAR(255),
        "logon"     VARCHAR(30)
    ) AS $$

/*
SELECT * FROM Seguranca.RefazLogin(3)
*/

BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.nome,
        u.sobrenome,
        u.email,
        u.logon
    FROM Seguranca.usuario u
    WHERE u.id = pId;
END;
$$
LANGUAGE PLPGSQL;