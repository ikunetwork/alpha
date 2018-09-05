const express = require('express');
const bodyParser = require('body-parser');

const ResearchTarget = require('./api/ResearchTarget');
const License = require('./api/License');
const Faucet = require('./api/Faucet');
const Proposal = require('./api/Proposal');
const Faq = require('./api/Faq');
const User = require('./api/User');
const S3Uploader = require('./api/Uploads');
const path = require('path');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const { ExtractJwt, Strategy } = passportJWT;

const app = express();

const port = process.env.PORT || 8080;

const router = express.Router();

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = process.env.JWT_SECRET;
jwtOptions.passReqToCallback = true;
const strategy = new Strategy(jwtOptions, (req, jwt_payload, done) => {
  console.log('JWT :: payload received', jwt_payload, req.url);
  // usually this would be a database call:

  User.findById(jwt_payload.id)
    .then(user => {
      if (
        (user && user.verified) ||
        req.url === '/user/verify-email' ||
        req.url === '/user/resend-email' ||
        (req.url === '/user/me' && req.method === 'PATCH')
      ) {
        done(null, user);
      } else {
        console.log(user, req.url, req.method);
        done(null, false, { message: 'unauthorized' });
      }
    })
    .catch(e => {
      console.log('JTW :: exception on the strategy', e);
      done(null, false, { message: 'unauthorized' });
    });
});

passport.use(strategy);

// No need to enable CORS for production
if (process.env.NODE_ENV !== 'production') {
  // enable cors
  router.use(
    cors({
      allowedHeaders: ['Authorization', 'Content-Type'],
      exposedHeaders: ['Authorization'],
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
    })
  );
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// middleware
router.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('DEBUG :: =========================');
    console.log('DEBUG :: URL: ', req.path);
    console.log('DEBUG :: METHOD: ', req.method);

    if (
      req.method === 'POST' ||
      req.method === 'PUT' ||
      req.method === 'PATCH'
    ) {
      console.log('DEBUG :: PARAMS: ', req.body);
    } else {
      console.log('DEBUG :: QUERY STRING: ', req.query);
    }
  }
  next();
});

//
router.get('/', (req, res) => {
  res.json({ message: 'HELLO THERE HUMAN' });
});

router
  .route('/research-target')

  // create a research target (POST http://localhost:8080/api/research-target)
  .post((req, res) => {
    if (req.body.name) {
      ResearchTarget.post(req)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          res.status(400).json(error);
        });
    } else {
      res.send({ error: 'missing parameters' });
    }
  })

  // update a research target (PUT http://localhost:8080/api/research-target)
  .put((req, res) => {
    if (req.body.id) {
      ResearchTarget.put(req)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          console.log('ROUTE :: PUT :: /research-target :: 500', error);
          res.status(500).send(error);
        });
    } else {
      res.send({ error: 'missing parameters' });
    }
  })

  // get all the research targets (GET http://localhost:8080/api/research-target)
  .get((req, res) => {
    ResearchTarget.get(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        res.send(error);
      });
  });

router
  .route('/research-target/vote')

  // Vote for a research target (POST http://localhost:8080/api/research-target/vote)
  .post((req, res) => {
    if (req.body.id) {
      ResearchTarget.vote(req)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          console.log('ROUTE :: POST :: /research-target/vote :: ', error);
          res.status(400).send(error);
        });
    } else {
      res.send({ error: 'missing parameters' });
    }
  })
  .get((req, res) => {
    ResearchTarget.getVoteCount(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        res.send(error);
      });
  });

router
  .route('/user/signup')

  // User signup (POST http://localhost:8080/api/user/signup)
  .post((req, res) => {
    User.signup(req)
      .then(user => {
        const token = jwt.sign(user, jwtOptions.secretOrKey);
        res.json({ token });
      })
      .catch(error => {
        console.log('ROUTE :: POST :: /user/signup :: 500', error);
        res.status(500).send(error);
      });
  });

router
  .route('/user/login')

  // User login (POST http://localhost:8080/api/user/login)
  .post((req, res) => {
    User.login(req)
      .then(user => {
        const token = jwt.sign(user, jwtOptions.secretOrKey);
        res.json({ token });
      })
      .catch(error => {
        console.log('ROUTE :: POST :: /user/login :: 401', error);
        res.status(401).send(error);
      });
  });

router.get('/user/me', (req, res, next) => {
  passport.authenticate('jwt', (err, user, response) => {
    if (err) {
      res.json(err);
    } else if (response && response.error) {
      res.status(401).json(response);
      console.log('ROUTE :: GET :: /user/me :: 401', response);
    } else {
      res.json(user);
    }
  })(req, res, next);
});

router.post(
  '/user/resend-email',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const base_url = `${req.protocol}://${req
      .get('host')
      .replace('8080', '3000')}`;

    User.sendEmail(req.user, base_url)
      .then(response => {
        res.send(response);
      })
      .catch(error => {
        console.log('ROUTE :: POST :: /user/resend-email :: 500', error);
        res.status(500).send(error);
      });
  }
);

router.post(
  '/user/verify-email',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.verifyEmail(req)
      .then(response => {
        res.send(response);
      })
      .catch(error => {
        console.log('ROUTE :: POST :: /user/verify-email :: 500', error);
        res.status(500).send(error);
      });
  }
);

router.patch(
  '/user/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.update(req)
      .then(response => {
        // If it's a brand new user
        // We need to send the verification email!
        if (!req.user.verified) {
          User.sendEmail(response);
        }
        res.json(response);
      })
      .catch(error => {
        console.log('ROUTE :: PATCH :: /user/me :: 500', error);
        res.status(500).send(error);
      });
  }
);

router.post(
  '/proposal',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Proposal.post(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.log('ROUTE :: POST :: /proposal :: 500', error);
        res.status(500).send(error);
      });
  }
);

router
  .route('/proposal')
  // update a proposal (PUT http://localhost:8080/api/proposal)
  .put((req, res) => {
    if (req.body.id) {
      Proposal.put(req)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          console.log('ROUTE :: PUT :: /proposal :: 500', error);
          res.status(500).send(error);
        });
    } else {
      res.send({ error: 'missing parameters' });
    }
  })

  // get all the proposals (GET http://localhost:8080/api/proposal)
  .get((req, res) => {
    Proposal.get(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.log('ROUTE :: GET :: /proposal :: 500', error);
        res.status(500).send(error);
      });
  });

router
  .route('/proposal/vote')

  // Vote for a proposal (POST http://localhost:8080/api/proposal/vote)
  .post((req, res) => {
    if (req.body.id) {
      Proposal.vote(req)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          console.log('ROUTE :: POST :: /proposal/vote :: 500', error);
          res.status(500).send(error);
        });
    } else {
      res.send({ error: 'missing parameters' });
    }
  })
  .get((req, res) => {
    Proposal.getVoteCount(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.log('ROUTE :: GET :: /proposal/vote :: 500', error);
      });
  });

router
  .route('/proposal/comment')

  .get((req, res) => {
    Proposal.getComments(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.log('ROUTE :: GET :: /proposal/comment :: 500', error);
      });
  });

router.post(
  '/proposal/comment',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.body.proposal_id) {
      Proposal.addComment(req)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          console.log('ROUTE :: POST :: /proposal/comment :: 500', error);
          res.status(500).send(error);
        });
    } else {
      res.send({ error: 'missing parameters' });
    }
  }
);

router.route('/proposal/license').post((req, res) => {
  if (req.body.id && req.body.address && req.body.sign) {
    Proposal.accessToLicense(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.log('ROUTE :: GET :: /proposal/license :: 500', error);
        res.status(500).send(error);
      });
  } else {
    res.send({ error: 'missing parameters' });
  }
});

router
  .route('/faq')

  // get the faq (GET http://localhost:8080/api/faq)
  .get((req, res) => {
    Faq.get(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.log('ROUTE :: GET :: /faq :: 500', error);
        res.status(500).send(error);
      });
  });

router.route('/sign-s3').get((req, res) => {
  S3Uploader.sign(req)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      console.log('ROUTE :: GET :: /sign-s3 :: 500', error);
      res.status(500).send(error);
    });
});

router.post('/faucet/send-tokens', (req, res) => {
  Faucet.sendTokens(req)
    .then(response => {
      res.send(response);
    })
    .catch(error => {
      console.log('ROUTE :: POST :: /faucet/send-tokens :: 500', error);
      res.status(500).send(error);
    });
});

router
  .route('/license')
  // update the license (PUT http://localhost:8080/api/license)
  .put((req, res) => {
    if (req.body.data) {
      License.put(req.body.data)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          console.log('ROUTE :: PUT :: /license :: 500', error);
          res.status(500).send(error);
        });
    } else {
      res.send({ error: 'missing parameters' });
    }
  })

  // get the license (GET http://localhost:8080/api/license)
  .get((req, res) => {
    License.get(req)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        res.send(error);
      });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static('build_webpack'));
}

app.get('/*', (req, res) => {
  res.sendfile(path.join(__dirname, 'build_webpack/index.html'), err => {
    if (err) {
      console.log('ROUTE :: SENDFILE :: /* :: 500', err);
      res.status(500).send(err);
    }
  });
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`Server running on port ${port}`);
