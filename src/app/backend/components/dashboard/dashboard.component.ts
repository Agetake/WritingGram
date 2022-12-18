import { Component, OnInit } from '@angular/core';
import { DisciplineService } from 'src/app/shared/services/discipline/discipline.service';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { PaperTypeService } from 'src/app/shared/services/paper-type/paper-type.service';
import { levels } from 'src/assets/json/levels.data';
import { paperTypes } from 'src/assets/json/paper-types.data';
import { disciplines } from 'src/assets/json/disciplines.data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PaperTypeInterface } from 'src/app/shared/interfaces/paper-type.interface';
import { LevelInterface } from 'src/app/shared/interfaces/level.interface';
import { PaperDisciplineInterface } from 'src/app/shared/interfaces/paper-discipline.interface';
import { UserService } from 'src/app/shared/services/user/user.service';
import { take } from 'rxjs';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  levels = levels;

  paperTypes = paperTypes;

  disciplines = disciplines;

  user: UserInterface | null = null;

  constructor(
    private paperTypeService: PaperTypeService,
    private levelService: LevelService,
    private disciplineService: DisciplineService,
    private sharedService: SharedService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
        if (user.type === 'writer' && (!user.education || !user.education.length || !user.writingStyles || !user.registrationComplete)) {
          this.router.navigateByUrl('/complete-registration');
        }
      }
    });
  }

  async loadData() {
    await Promise.all(this.paperTypes.map(async (type) => {
      let paperType: PaperTypeInterface = {
        id: this.sharedService.generateUniqueId(type.name),
        name: type.name,
        code: type.code
      };
      await this.paperTypeService.create(paperType)
    }));

    await Promise.all(this.levels.map(async (level) => {
      let paperLevel: LevelInterface = {
        id: this.sharedService.generateUniqueId(level.level),
        level: level.level,
        code: level.code
      };
      await this.levelService.create(paperLevel)
    }));

    await Promise.all(this.disciplines.map(async (discipline) => {
      let paperDiscipline: PaperDisciplineInterface = {
        id: this.sharedService.generateUniqueId(discipline.name),
        name: discipline.name,
        code: discipline.code
      };
      await this.disciplineService.create(paperDiscipline)
    }));
    console.log('everything done')
  }
}
