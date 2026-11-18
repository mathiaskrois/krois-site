import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, cp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

test("assembler mounts Games, redirects legacy Ord, and preserves existing mounts", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "krois-games-assembly-"));
  const git = (args, cwd) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  try {
    await cp(new URL("../scripts", import.meta.url), join(fixture, "scripts"), { recursive: true });
    await writeFile(join(fixture, "index.html"), "root site");
    await writeFile(join(fixture, "CNAME"), "krois.dk");
    const releases = {};
    for (const name of ["unbound-web", "WordWin", "dtu-courses", "games"]) {
      const source = join(fixture, "sources", name);
      await mkdir(join(source, "dist"), { recursive: true });
      await writeFile(join(source, "dist", "index.html"), name + " app");
      if (name === "WordWin") {
        await mkdir(join(source, "hosting", "WordWin"), { recursive: true });
        await writeFile(join(source, "hosting", "WordWin", "index.html"), "legacy WordWin");
      }
      if (name === "games") {
        await mkdir(join(source, "hosting", "ord"), { recursive: true });
        await writeFile(join(source, "hosting", "ord", "index.html"), "/games/ord/");
        await writeFile(join(source, "hosting", "ord", "sw.js"), "retire Ord worker");
      }
      git(["init", "-b", "main"], source);
      git(["add", "."], source);
      git(["-c", "user.name=Assembly test", "-c", "user.email=test@localhost", "commit", "-m", "Fixture"], source);
      releases[name] = { repository: `mathiaskrois/${name}`, commit: git(["rev-parse", "HEAD"], source) };
    }
    await writeFile(join(fixture, "releases.json"), JSON.stringify(releases));
    execFileSync(process.execPath, ["scripts/build-site.mjs"], { cwd: fixture });
    for (const [name, mount] of [["games", "games"], ["WordWin", "wordwin"], ["unbound-web", "unbound"], ["dtu-courses", "dtu"]]) {
      assert.equal(await readFile(join(fixture, "dist", mount, "index.html"), "utf8"), name + " app");
      assert.deepEqual(JSON.parse(await readFile(join(fixture, "dist", mount, "release.json"), "utf8")), releases[name]);
    }
    assert.equal(await readFile(join(fixture, "dist", "CNAME"), "utf8"), "krois.dk");
    assert.equal(await readFile(join(fixture, "dist", "ord", "index.html"), "utf8"), "/games/ord/");
    assert.equal(await readFile(join(fixture, "dist", "ord", "sw.js"), "utf8"), "retire Ord worker");
    releases.games.commit = "a".repeat(40);
    await writeFile(join(fixture, "releases.json"), JSON.stringify(releases));
    assert.throws(() => execFileSync(process.execPath, ["scripts/build-site.mjs"], { cwd: fixture, stdio: "pipe" }), /does not match/);
    assert.equal(await readFile(join(fixture, "dist", "games", "index.html"), "utf8"), "games app");
  } finally {
    // Delete only the unique fixture directory created beneath the OS temp root.
    assert.ok(resolve(fixture).startsWith(resolve(tmpdir()) + (process.platform === "win32" ? "\\" : "/")));
    assert.ok(fixture.includes("krois-games-assembly-"));
    await rm(fixture, { recursive: true, force: true });
  }
});
