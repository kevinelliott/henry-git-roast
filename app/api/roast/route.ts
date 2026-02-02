import { NextRequest, NextResponse } from 'next/server';

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  hireable: boolean | null;
}

interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  description: string | null;
  created_at: string;
  pushed_at: string;
}

function generateRoasts(user: GitHubUser, repos: GitHubRepo[]): string[] {
  const roasts: string[] = [];
  
  // Account age roasts
  const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
  if (accountAge > 10) {
    roasts.push(`Been on GitHub for ${accountAge} years and still haven't figured out how to get more than ${user.followers} followers? That's commitment to mediocrity.`);
  } else if (accountAge < 1) {
    roasts.push(`Fresh account, huh? Give it a few months before your "I'll commit every day" resolution dies like all the others.`);
  }

  // Repo count roasts
  if (user.public_repos === 0) {
    roasts.push(`Zero public repos? Are you using GitHub as a social network or what? Even my grandma has pushed more code.`);
  } else if (user.public_repos > 100) {
    roasts.push(`${user.public_repos} repos?! Quality over quantity is just a myth to you, isn't it?`);
  } else if (user.public_repos < 5 && accountAge > 2) {
    roasts.push(`Only ${user.public_repos} repos after ${accountAge} years? I've seen more productivity from a broken CI pipeline.`);
  }

  // Follower/following ratio roasts
  if (user.following > user.followers * 3 && user.following > 50) {
    roasts.push(`Following ${user.following} people but only ${user.followers} follow back? That's giving "please notice me senpai" energy.`);
  } else if (user.followers > 1000 && user.following < 10) {
    roasts.push(`${user.followers} followers but you only follow ${user.following} people? Very "I'm too important to follow back" of you.`);
  }

  // Bio roasts
  if (user.bio) {
    const bio = user.bio.toLowerCase();
    if (bio.includes('full stack')) {
      roasts.push(`"Full stack developer" in your bio? So you're mediocre at twice as many things. Impressive.`);
    }
    if (bio.includes('10x') || bio.includes('ninja') || bio.includes('rockstar')) {
      roasts.push(`Did you really put "${bio.includes('10x') ? '10x' : bio.includes('ninja') ? 'ninja' : 'rockstar'}" in your bio? It's giving 2015 LinkedIn recruiter bait.`);
    }
    if (bio.includes('entrepreneur')) {
      roasts.push(`"Entrepreneur" - so you have 47 unfinished side projects and a podcast idea you'll never start?`);
    }
    if (bio.includes('open source')) {
      roasts.push(`Claims to love open source but we both know you've never actually read the LICENSE file.`);
    }
    if (bio.length > 150) {
      roasts.push(`Your bio is ${bio.length} characters? This isn't a resume, it's a profile. Some of us have scrolling fatigue.`);
    }
  } else {
    roasts.push(`No bio? Too mysterious to tell us anything about yourself, or just couldn't think of a single interesting thing to say?`);
  }

  // Language roasts
  const languages = repos
    .filter(r => r.language && !r.fork)
    .map(r => r.language as string);
  const langCounts = languages.reduce((acc, lang) => {
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  if (topLangs.includes('JavaScript') && topLangs.includes('TypeScript')) {
    roasts.push(`Using both JavaScript and TypeScript? Pick a side. The type safety fence isn't comfortable to sit on.`);
  }
  if (topLangs.includes('JavaScript') && !topLangs.includes('TypeScript')) {
    roasts.push(`Still writing plain JavaScript in ${new Date().getFullYear()}? Living dangerously with those "undefined is not a function" errors, I see.`);
  }
  if (topLangs.includes('PHP')) {
    roasts.push(`PHP developer? Bold of you to admit that publicly. Respect for the confidence, I guess.`);
  }
  if (topLangs.includes('Java')) {
    roasts.push(`Java? How's the AbstractFactoryBeanProviderStrategyImpl working out for ya?`);
  }
  if (topLangs.includes('Rust')) {
    roasts.push(`Rust developer? Tell me you spend more time fighting the borrow checker than writing actual features without telling me.`);
  }
  if (topLangs.includes('Go')) {
    roasts.push(`Go developer? How's it feel writing "if err != nil" 47 times per function?`);
  }
  if (topLangs.includes('Python')) {
    roasts.push(`Python main? So you basically write fancy bash scripts and call yourself a developer. Relatable, honestly.`);
  }

  // Repo name roasts
  const repoNames = repos.filter(r => !r.fork).map(r => r.name.toLowerCase());
  if (repoNames.some(n => n.includes('todo') || n.includes('task'))) {
    roasts.push(`You made a todo app? Groundbreaking. Revolutionary. Never been done before.`);
  }
  if (repoNames.some(n => n.includes('portfolio') || n.includes('personal-site'))) {
    roasts.push(`Got a portfolio repo that was last updated ${Math.floor(Math.random() * 3) + 1} years ago? We all have abandoned dreams.`);
  }
  if (repoNames.some(n => n.includes('dotfiles'))) {
    roasts.push(`Dotfiles repo? Spending 4 hours customizing your terminal to save 4 seconds is peak developer behavior.`);
  }
  if (repoNames.some(n => n.includes('awesome'))) {
    roasts.push(`An "awesome-" list? A curated collection of links you saved and forgot about. Classic.`);
  }

  // Star roasts
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  if (totalStars === 0 && repos.length > 0) {
    roasts.push(`Not a single star across all your repos? Your code is so exclusive even you don't star it.`);
  } else if (totalStars < 10 && repos.length > 20) {
    roasts.push(`${repos.length} repos and only ${totalStars} total stars? The GitHub algorithm said "nah" and moved on.`);
  }

  // Fork ratio roasts
  const forkCount = repos.filter(r => r.fork).length;
  if (forkCount > repos.length * 0.7 && repos.length > 5) {
    roasts.push(`${Math.round((forkCount / repos.length) * 100)}% of your repos are forks? You're basically a human git clone.`);
  }

  // Activity roasts
  const recentActivity = repos.filter(r => {
    const pushed = new Date(r.pushed_at);
    const monthsAgo = (Date.now() - pushed.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo < 3;
  });
  if (recentActivity.length === 0 && repos.length > 0) {
    roasts.push(`No commits in the last 3 months? Your green squares are looking pretty barren. GitHub thinks you might be a bot that gave up.`);
  }

  // Hireable roast
  if (user.hireable === true) {
    roasts.push(`Marked as "hireable" - nothing says desperation like a boolean flag. Just kidding, we've all been there. Good luck out there! 💪`);
  }

  // Shuffle and limit roasts
  const shuffled = roasts.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(5, shuffled.length));
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Fetch user data
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'henry-git-roast',
      },
    });

    if (userRes.status === 404) {
      return NextResponse.json({ error: 'User not found. Did they delete their account in shame?' }, { status: 404 });
    }

    if (!userRes.ok) {
      throw new Error('Failed to fetch user');
    }

    const user: GitHubUser = await userRes.json();

    // Fetch repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'henry-git-roast',
      },
    });

    const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

    // Calculate stats
    const languages = repos
      .filter(r => r.language && !r.fork)
      .map(r => r.language as string);
    const langCounts = languages.reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);

    const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
    const accountAgeStr = accountAge === 0 ? 'New this year' : `${accountAge} year${accountAge !== 1 ? 's' : ''} old`;

    // Generate roasts
    const roasts = generateRoasts(user, repos);

    // If we couldn't generate any roasts, add a default one
    if (roasts.length === 0) {
      roasts.push(`You know what? I looked through your profile and I got nothing. Either you're perfect or so average that even the roast generator couldn't find anything interesting. That's almost impressive.`);
    }

    return NextResponse.json({
      username: user.login,
      avatar: user.avatar_url,
      roasts,
      stats: {
        repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        topLanguages,
        accountAge: accountAgeStr,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Roast error:', error);
    return NextResponse.json(
      { error: 'Failed to roast. The GitHub API might be rate-limiting us, or the user broke something.' },
      { status: 500 }
    );
  }
}
