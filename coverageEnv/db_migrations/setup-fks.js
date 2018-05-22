const DB = require('../api/Database');

console.log('Adding Foreign keys and indexes...');

const commands = [
  {
    name: 'fk_proposal_user',
    query: `
        ALTER TABLE "proposal" 
          ADD CONSTRAINT fk_proposal_user FOREIGN KEY (created_by)
          REFERENCES "user" (id);
      `,
  },
  {
    name: 'fk_proposal_vote',
    query: `
        ALTER TABLE "proposal_vote" 
          ADD CONSTRAINT fk_proposal_vote FOREIGN KEY (proposal_id)
              REFERENCES proposal (id);
      `,
  },
  {
    name: 'fk_research_target_vote',
    query: `
        ALTER TABLE "research_target_vote" 
          ADD CONSTRAINT fk_research_target_vote FOREIGN KEY (research_target_id)
              REFERENCES research_target (id);
      `,
  },
  {
    name: 'comments_index_1',
    query: `create index on proposal_comment (proposal_id);`,
  },
  {
    name: 'comments_index_1',
    query: `create index on proposal_comment (parent_id);`,
  },
  {
    name: 'fk_proposal_comment',
    query: `
        ALTER TABLE "proposal_comment" 
          ADD CONSTRAINT fk_proposal_comment FOREIGN KEY (proposal_id)
          REFERENCES "proposal" (id);
      `,
  },
  {
    name: 'fk_proposal_comment_user',
    query: `
        ALTER TABLE "proposal_comment" 
          ADD CONSTRAINT fk_proposal_comment_user FOREIGN KEY (created_by)
          REFERENCES "user" (id);
      `,
  },
];

commands.forEach(command => {
  DB.query(command.query).then(_ => {
    console.log(`${command.name} created succesfully`);
  });
});
