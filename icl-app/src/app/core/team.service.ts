import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { Team, TeamSearchField } from './models';

interface TeamRow {
  id: number;
  logo: string | null;
  name: string;
  captain_name: string;
  captain_phone: string;
  address: string | null;
  comment: string | null;
  created_at: string;
}

const toTeam = (r: TeamRow): Team => ({
  id: r.id,
  logo: r.logo,
  name: r.name,
  captainName: r.captain_name,
  captainPhone: r.captain_phone,
  address: r.address ?? '',
  comment: r.comment ?? '',
  createdAt: r.created_at,
});

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly db = inject(DatabaseService);

  async search(term: string, field: TeamSearchField = 'all'): Promise<Team[]> {
    const q = term.trim();
    if (!q) {
      return (await this.db.query<TeamRow>('SELECT * FROM teams ORDER BY name COLLATE NOCASE')).map(toTeam);
    }

    const like = `%${q}%`;
    // Phone numbers are matched on digits only, so "0300-123" finds "0300 1234567".
    const digits = q.replace(/\D/g, '');
    const phoneExpr =
      "REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(captain_phone, ' ', ''), '-', ''), '+', ''), '(', ''), ')', '')";
    const phoneClause = digits ? `${phoneExpr} LIKE ?` : 'captain_phone LIKE ?';
    const phoneParam = digits ? `%${digits}%` : like;

    let where: string;
    let params: unknown[];
    switch (field) {
      case 'name':
        [where, params] = ['name LIKE ?', [like]];
        break;
      case 'captain':
        [where, params] = ['captain_name LIKE ?', [like]];
        break;
      case 'phone':
        [where, params] = [phoneClause, [phoneParam]];
        break;
      default:
        [where, params] = [`name LIKE ? OR captain_name LIKE ? OR ${phoneClause}`, [like, like, phoneParam]];
    }
    const rows = await this.db.query<TeamRow>(
      `SELECT * FROM teams WHERE ${where} ORDER BY name COLLATE NOCASE`,
      params,
    );
    return rows.map(toTeam);
  }

  async get(id: number): Promise<Team | null> {
    const rows = await this.db.query<TeamRow>('SELECT * FROM teams WHERE id = ?', [id]);
    return rows[0] ? toTeam(rows[0]) : null;
  }

  async save(team: Team): Promise<number> {
    const values = [
      team.logo,
      team.name.trim(),
      team.captainName.trim(),
      team.captainPhone.trim(),
      team.address.trim(),
      team.comment.trim(),
    ];
    if (team.id) {
      await this.db.run(
        `UPDATE teams SET logo = ?, name = ?, captain_name = ?, captain_phone = ?, address = ?, comment = ?
         WHERE id = ?`,
        [...values, team.id],
      );
      return team.id;
    }
    const id = await this.db.run(
      `INSERT INTO teams (logo, name, captain_name, captain_phone, address, comment)
       VALUES (?, ?, ?, ?, ?, ?)`,
      values,
    );
    return id ?? 0;
  }

  async remove(id: number): Promise<void> {
    await this.db.run('DELETE FROM teams WHERE id = ?', [id]);
  }
}
