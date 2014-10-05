
var assert = require('assert');
var equal = require('assert-dir-equal');
var exists = require('fs').existsSync;
var rm = require('rimraf').sync;
var Khaos = require('..');

describe('Khaos', function(){
  beforeEach(function(){
    rm('test/tmp');
  });

  it('should require a source directory', function(){
    assert.throws(function(){
      new Khaos();
    }, /You must provide a source template\./);
  });

  it('should require a destination directory', function(){
    assert.throws(function(){
      new Khaos('src');
    }, /You must provide a destination\./);
  });

  describe('#run', function(){
    it('should error out', function(done){
      run('error', [''], function(err){
        assert(err);
        done();
      });
    });

    it('should fill in files', function(done){
      run('basic', ['basic'], done);
    });

    it('should fill in multiple variables', function(done){
      run('multiple', ['title', 'description'], done);
    });

    it('should fill in nested files', function(done){
      run('nested', ['nested'], done);
    });

    it('should fill in file names', function(done){
      run('file-names', ['file-names'], done);
    });

    it('should fill in folder names', function(done){
      run('folder-names', ['folder-names'], done);
    });

    it('should handle conditionals', function(done){
      run('conditionals', ['title', 'n', 'description'], done);
    });

    it('should handle conditional files', function(done){
      run('conditional-files', ['y'], done);
    });

    it('should handle conditional folders', function(done){
      run('conditional-folders', ['y'], done);
    });

    it('should register case helpers', function(done){
      run('case', ['case'], done);
    });

    it('should register a default helper', function(done){
      run('default', [''], done);
    });

    it('should register a date helper', function(done){
      run('date', [], done);
    });

    it('should handle single-file templates', function(done){
      run('file', ['file'], done);
    });
  });
});

/**
 * Test convenience.
 *
 * @param {String} fixture
 * @param {Array} answers
 * @param {Function} done
 */

function run(fixture, answers, done){
  Khaos('test/fixtures/' + fixture + '/in', 'test/tmp')
    .run(function(err){
      if (err) return done(err);
      equal('test/tmp', 'test/fixtures/' + fixture + '/out');
      done();
    });

  setTimeout(function(){
    answers.forEach(answer);
  }, 20);
}

/**
 * Write an answer `str` to stdin.
 *
 * @param {String} str
 * @param {Function} fn
 */

function answer(str){
  str.split('').forEach(press);
  press('', { name: 'enter' });
}

/**
 * Trigger a keypress on stdin with `c` and `key`.
 *
 * @param {String} c
 * @param {Object} key
 */

function press(c, key){
  process.stdin.emit('keypress', c, key);
}