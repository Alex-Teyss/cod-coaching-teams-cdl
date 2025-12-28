import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Better Auth's default password hashing (from their source code)
// They use a simple salt:hash format with crypto.pbkdf2
async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ':' + derivedKey.toString('hex'))
    })
  })
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in reverse order of dependencies)
  console.log('🗑️  Clearing existing data...')
  await prisma.playerStats.deleteMany()
  await prisma.screenshot.deleteMany()
  await prisma.match.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.invitation.deleteMany()
  await prisma.team.deleteMany() // Delete teams before users (coach relationship)
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Hash password for all users (password: "Password123!")
  // Using Better Auth's password hashing format
  const hashedPassword = await hashPassword('Password123!')

  // 1. Create Admin user
  console.log('👤 Creating admin user...')
  const admin = await prisma.user.create({
    data: {
      username: 'Admin User',
      email: 'admin@codcoaching.com',
      emailVerified: true,
      role: 'ADMIN',
      onboardingCompleted: true,
      accounts: {
        create: {
          accountId: 'admin-account',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  // 2. Create Coaches with Teams
  console.log('🎯 Creating coaches and teams...')

  const coach1 = await prisma.user.create({
    data: {
      username: 'Jean Dupont',
      email: 'jean.dupont@codcoaching.com',
      emailVerified: true,
      role: 'COACH',
      onboardingCompleted: true,
      accounts: {
        create: {
          accountId: 'coach1-account',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  const team1 = await prisma.team.create({
    data: {
      name: 'Elite Gaming',
      coachId: coach1.id,
      isValidated: true,
    },
  })

  const coach2 = await prisma.user.create({
    data: {
      username: 'Marie Martin',
      email: 'marie.martin@codcoaching.com',
      emailVerified: true,
      role: 'COACH',
      onboardingCompleted: true,
      accounts: {
        create: {
          accountId: 'coach2-account',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  const team2 = await prisma.team.create({
    data: {
      name: 'Pro Tactics',
      coachId: coach2.id,
      isValidated: true,
    },
  })

  const coach3 = await prisma.user.create({
    data: {
      username: 'Pierre Dubois',
      email: 'pierre.dubois@codcoaching.com',
      emailVerified: true,
      role: 'COACH',
      onboardingCompleted: true,
      accounts: {
        create: {
          accountId: 'coach3-account',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  const team3 = await prisma.team.create({
    data: {
      name: 'Thunder Squad',
      coachId: coach3.id,
      isValidated: false, // Not validated yet (less than 4 players)
    },
  })

  // 3. Create Players for Team 1 (Elite Gaming)
  console.log('🎮 Creating players for Elite Gaming...')
  const team1Players = await Promise.all([
    prisma.user.create({
      data: {
        username: 'Alex Storm',
        email: 'alex.storm@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team1.id,
        accounts: {
          create: {
            accountId: 'player1-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'Sarah Blaze',
        email: 'sarah.blaze@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team1.id,
        accounts: {
          create: {
            accountId: 'player2-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'Mike Shadow',
        email: 'mike.shadow@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team1.id,
        accounts: {
          create: {
            accountId: 'player3-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'Emma Viper',
        email: 'emma.viper@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team1.id,
        accounts: {
          create: {
            accountId: 'player4-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
  ])

  // 4. Create Players for Team 2 (Pro Tactics)
  console.log('🎮 Creating players for Pro Tactics...')
  const team2Players = await Promise.all([
    prisma.user.create({
      data: {
        username: 'Lucas Ghost',
        email: 'lucas.ghost@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team2.id,
        accounts: {
          create: {
            accountId: 'player5-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'Nina Hawk',
        email: 'nina.hawk@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team2.id,
        accounts: {
          create: {
            accountId: 'player6-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'Tom Reaper',
        email: 'tom.reaper@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team2.id,
        accounts: {
          create: {
            accountId: 'player7-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'Lisa Phantom',
        email: 'lisa.phantom@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team2.id,
        accounts: {
          create: {
            accountId: 'player8-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
  ])

  // 5. Create Players for Team 3 (Thunder Squad - only 2 players)
  console.log('🎮 Creating players for Thunder Squad...')
  const team3Players = await Promise.all([
    prisma.user.create({
      data: {
        username: 'Max Thunder',
        email: 'max.thunder@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team3.id,
        accounts: {
          create: {
            accountId: 'player9-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'Zoe Lightning',
        email: 'zoe.lightning@player.com',
        emailVerified: true,
        role: 'PLAYER',
        onboardingCompleted: true,
        teamId: team3.id,
        accounts: {
          create: {
            accountId: 'player10-account',
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    }),
  ])

  // 6. Create Sample Matches and Stats for Team 1
  console.log('🏆 Creating sample matches for Elite Gaming...')

  const match1 = await prisma.match.create({
    data: {
      teamId: team1.id,
      game: 'Black Ops 6',
      gameMode: 'Hardpoint',
      map: 'Nuketown',
      result: 'WIN',
      teamScore: 250,
      opponentScore: 180,
      opponentTeamName: 'OpTic Gaming',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  })

  // Create stats for match 1
  await Promise.all(
    team1Players.map((player, index) => {
      const kills = 15 + Math.floor(Math.random() * 20)
      const deaths = 8 + Math.floor(Math.random() * 15)
      return prisma.playerStats.create({
        data: {
          matchId: match1.id,
          playerId: player.id,
          playerName: player.username,
          kills,
          deaths,
          kdRatio: parseFloat((kills / deaths).toFixed(2)),
          hillTime: `${Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        },
      })
    })
  )

  const match2 = await prisma.match.create({
    data: {
      teamId: team1.id,
      game: 'Black Ops 6',
      gameMode: 'Search & Destroy',
      map: 'Raid',
      result: 'LOSS',
      teamScore: 3,
      opponentScore: 6,
      opponentTeamName: 'FaZe Clan',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  })

  await Promise.all(
    team1Players.map((player) => {
      const kills = 8 + Math.floor(Math.random() * 12)
      const deaths = 5 + Math.floor(Math.random() * 10)
      return prisma.playerStats.create({
        data: {
          matchId: match2.id,
          playerId: player.id,
          playerName: player.username,
          kills,
          deaths,
          kdRatio: parseFloat((kills / deaths).toFixed(2)),
          plants: Math.floor(Math.random() * 3),
          defuses: Math.floor(Math.random() * 2),
        },
      })
    })
  )

  const match3 = await prisma.match.create({
    data: {
      teamId: team1.id,
      game: 'Black Ops 6',
      gameMode: 'Control',
      map: 'Express',
      result: 'WIN',
      teamScore: 3,
      opponentScore: 1,
      opponentTeamName: '100 Thieves',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  })

  await Promise.all(
    team1Players.map((player) => {
      const kills = 20 + Math.floor(Math.random() * 25)
      const deaths = 10 + Math.floor(Math.random() * 18)
      return prisma.playerStats.create({
        data: {
          matchId: match3.id,
          playerId: player.id,
          playerName: player.username,
          kills,
          deaths,
          kdRatio: parseFloat((kills / deaths).toFixed(2)),
          captures: Math.floor(Math.random() * 5),
          zoneTime: `${Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        },
      })
    })
  )

  // 7. Create Sample Matches for Team 2
  console.log('🏆 Creating sample matches for Pro Tactics...')

  const match4 = await prisma.match.create({
    data: {
      teamId: team2.id,
      game: 'MW3',
      gameMode: 'Hardpoint',
      map: 'Standoff',
      result: 'WIN',
      teamScore: 250,
      opponentScore: 220,
      opponentTeamName: 'Team Envy',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  })

  await Promise.all(
    team2Players.map((player) => {
      const kills = 18 + Math.floor(Math.random() * 22)
      const deaths = 9 + Math.floor(Math.random() * 16)
      return prisma.playerStats.create({
        data: {
          matchId: match4.id,
          playerId: player.id,
          playerName: player.username,
          kills,
          deaths,
          kdRatio: parseFloat((kills / deaths).toFixed(2)),
          hillTime: `${Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        },
      })
    })
  )

  const match5 = await prisma.match.create({
    data: {
      teamId: team2.id,
      game: 'MW3',
      gameMode: 'Search & Destroy',
      map: 'Hijacked',
      result: 'WIN',
      teamScore: 6,
      opponentScore: 4,
      opponentTeamName: 'Atlanta Reign',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
  })

  await Promise.all(
    team2Players.map((player) => {
      const kills = 10 + Math.floor(Math.random() * 15)
      const deaths = 4 + Math.floor(Math.random() * 8)
      return prisma.playerStats.create({
        data: {
          matchId: match5.id,
          playerId: player.id,
          playerName: player.username,
          kills,
          deaths,
          kdRatio: parseFloat((kills / deaths).toFixed(2)),
          plants: Math.floor(Math.random() * 4),
          defuses: Math.floor(Math.random() * 3),
        },
      })
    })
  )

  // 8. Create Pending Invitations for Team 3
  console.log('📧 Creating pending invitations...')
  await prisma.invitation.create({
    data: {
      email: 'newplayer1@example.com',
      teamId: team3.id,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  })

  await prisma.invitation.create({
    data: {
      email: 'newplayer2@example.com',
      teamId: team3.id,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  // 9. Create Sample Notifications
  console.log('🔔 Creating sample notifications...')
  await prisma.notification.create({
    data: {
      userId: team1Players[0].id,
      type: 'MATCH_COMPLETED',
      title: 'Match terminé',
      message: 'Votre match sur Nuketown est terminé. Consultez vos stats !',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: coach1.id,
      type: 'TEAM_VALIDATED',
      title: 'Équipe validée',
      message: 'Votre équipe Elite Gaming a été validée avec succès !',
      read: true,
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`  - 1 Admin user`)
  console.log(`  - 3 Coaches`)
  console.log(`  - 3 Teams (2 validated, 1 pending)`)
  console.log(`  - 10 Players`)
  console.log(`  - 5 Matches`)
  console.log(`  - ${team1Players.length * 3 + team2Players.length * 2} Player Stats`)
  console.log(`  - 2 Pending Invitations`)
  console.log(`  - 2 Notifications`)
  console.log('\n🔐 All users password: Password123!')
  console.log('\n👤 Test accounts:')
  console.log(`  Admin: admin@codcoaching.com`)
  console.log(`  Coach 1: jean.dupont@codcoaching.com`)
  console.log(`  Coach 2: marie.martin@codcoaching.com`)
  console.log(`  Coach 3: pierre.dubois@codcoaching.com`)
  console.log(`  Player 1: alex.storm@player.com`)
  console.log(`  Player 2: sarah.blaze@player.com`)
  console.log(`  ... (and 8 more players)`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
