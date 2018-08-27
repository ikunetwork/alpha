const DB = require('../api/Database');

console.log('Creating all the database tables...');

const commands = [
  {
    name: 'research_target_vote',
    constraint: 'fk_research_target_vote',
    query: `
      CREATE TABLE research_target_vote
      (
          ip text COLLATE pg_catalog."default" NOT NULL,
          research_target_id bigint NOT NULL,
          CONSTRAINT research_target_vote_pkey PRIMARY KEY (ip, research_target_id)
      )
      WITH (
          OIDS = FALSE
      )
    `,
  },
  {
    name: 'proposal_vote',
    table: 'true',
    constraint: 'fk_proposal_vote',
    query: `
      CREATE TABLE proposal_vote
      (
          ip text COLLATE pg_catalog."default" NOT NULL,
          proposal_id bigint NOT NULL,
          CONSTRAINT proposal_vote_pkey PRIMARY KEY (proposal_id, ip)
      )
      WITH (
          OIDS = FALSE
      )
    `,
  },
  {
    name: 'user',
    query: `
      CREATE TABLE "user"
      (
          id serial,
          address text COLLATE pg_catalog."default",
          signature text COLLATE pg_catalog."default",
          first_name text COLLATE pg_catalog."default",
          last_name text COLLATE pg_catalog."default",
          email text COLLATE pg_catalog."default",
          username text COLLATE pg_catalog."default",
          organization text COLLATE pg_catalog."default",
          verified boolean DEFAULT false,
          created_at timestamp without time zone DEFAULT now(),
          CONSTRAINT user_pkey PRIMARY KEY (id)
      )
      WITH (
          OIDS = FALSE
      )
    `,
  },
  {
    name: 'proposal',
    constraint: 'fk_proposal_user',
    query: `
      CREATE TABLE proposal
      (
          id serial,
          created_by bigint,
          name text COLLATE pg_catalog."default",
          investigator_name text COLLATE pg_catalog."default",
          investigator_location text COLLATE pg_catalog."default",
          rare_disease boolean DEFAULT false,
          thesis text COLLATE pg_catalog."default",
          current_stage text COLLATE pg_catalog."default",
          empirical_data text COLLATE pg_catalog."default",
          anecdotal_data text COLLATE pg_catalog."default",
          scientific_justification text COLLATE pg_catalog."default",
          observations text COLLATE pg_catalog."default",
          funds_required text COLLATE pg_catalog."default",
          funding_process_duration text COLLATE pg_catalog."default",
          socioeconomic_implication text COLLATE pg_catalog."default",
          attachments text COLLATE pg_catalog."default",
          roadmap text COLLATE pg_catalog."default",
          image text COLLATE pg_catalog."default",
          approved boolean DEFAULT false,
          locked boolean DEFAULT false,
          start_time bigint,
          end_time bigint,
          rate text COLLATE pg_catalog."default",
          cap text COLLATE pg_catalog."default",
          decimals integer,
          token_name text COLLATE pg_catalog."default",
          token_symbol text COLLATE pg_catalog."default",
          status text COLLATE pg_catalog."default",
          address text COLLATE pg_catalog."default",
          token_address text COLLATE pg_catalog."default",
          finalized boolean DEFAULT false,
          goal_reached boolean DEFAULT false,
          funds_transfer_tx text COLLATE pg_catalog."default",
          ipfs_hash text COLLATE pg_catalog."default",
          encryption_key text COLLATE pg_catalog."default",
          created_at timestamp without time zone DEFAULT now(),
          CONSTRAINT proposal_pkey PRIMARY KEY (id)
      )
      WITH (
          OIDS = FALSE
      )
  `,
  },
  {
    name: 'research_target',
    query: `
      CREATE TABLE research_target
      (
          id serial,
          created_by bigint,
          created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
          name text COLLATE pg_catalog."default",
          description text COLLATE pg_catalog."default",
          author text COLLATE pg_catalog."default",
          picture text COLLATE pg_catalog."default",
          video text COLLATE pg_catalog."default",
          links text COLLATE pg_catalog."default",
          intro TEXT  COLLATE pg_catalog."default",
          conclusion TEXT  COLLATE pg_catalog."default",
          tags TEXT  COLLATE pg_catalog."default",
          disease_type TEXT  COLLATE pg_catalog."default",
          rare_disease boolean DEFAULT false,
          affected_people TEXT  COLLATE pg_catalog."default",
          biomarker TEXT  COLLATE pg_catalog."default",
          molecule TEXT  COLLATE pg_catalog."default",
          current_status TEXT  COLLATE pg_catalog."default",
          est_required TEXT  COLLATE pg_catalog."default",

          CONSTRAINT research_target_pkey PRIMARY KEY (id)
      )
      WITH (
          OIDS = FALSE
      )
    `,
  },
  {
    name: 'proposal_comment',
    table: 'true',
    constraint: 'fk_proposal_comment',
    query: `
      CREATE TABLE proposal_comment
      (
          id serial,
          created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
          created_by bigint NOT NULL,
          proposal_id bigint NOT NULL,
          comment text,
          parent_id int references proposal_comment(id),
          CONSTRAINT proposal_comment_pkey PRIMARY KEY (id)
      )
      WITH (
          OIDS = FALSE
      )
     `,
  },
];

console.log(`Dropping tables if necessary...`);

function recreateTable(command) {
  DB.query(`DROP TABLE IF EXISTS "${command.name}"`)
    .then(r => {
      DB.query(command.query)
        .then(_ => {
          console.log(`Table ${command.name} created succesfully`);
        })
        .catch(e => {
          console.log(`ERROR running ${command.name}...`);
        });
    })
    .catch(e => {
      console.log(`ERROR dropping ${command.name}...`);
    });
}

commands.forEach(command => {
  if (command.constraint) {
    DB.query(
      `ALTER TABLE IF EXISTS "${command.name}" DROP CONSTRAINT ${
        command.constraint
      }`
    )
      .then(_ => recreateTable(command))
      .catch(e => {
        console.log(`ERROR dropping constraint ${command.constraint}...`);
      });
  } else {
    recreateTable(command);
  }
});