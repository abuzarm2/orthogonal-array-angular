import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  NgForm,
} from '@angular/forms';
/**
 * @title Basic expansion panel
 *
 */
import { Arr } from './model';
import { listenOnPlayer } from '@angular/animations/browser/src/render/shared';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'expansion-overview-example',

  templateUrl: 'expansion-overview-example.html',
  styleUrls: ['expansion-overview-example.css'],
})
export class ExpansionOverviewExample {
  data: Array<{}> = [];
  onscreen=[]
  displayedColumns = [];
  rows: FormArray;
  map_col={}
  arr: Arr = { Factors: '0', Levels: '0' };
  addForm: FormGroup;
  panelOpenState: boolean = false;
  flag: boolean = false;
  obj: any;
  Gen_flag: boolean = false;
  Number_of_factor: string = '0';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required],
    });
    this.rows = this.fb.array([]);
  }
  ngOnInit() {
    this.addForm.get('items').valueChanges.subscribe((val) => {
      if (val === true) {
        this.addForm.get('items_value').setValue('yes');

        this.addForm.addControl('rows', this.rows);
      }
      if (val === false) {
        this.addForm.get('items_value').setValue('no');
        this.addForm.removeControl('rows');
      }
    });
  }

  onSave() {
    this.Gen_flag = false;
    if (Number(this.arr.Factors) != 0) {
      this.flag = true;
    } else {
      this.flag = false;
    }
    for (let index = 0; index < Number(this.arr.Factors); index++) {
      this.displayedColumns.push(String(index));
    }
    console.log(this.displayedColumns);
  }
  generate() {
    let count = {};
    for (let index = 0; index < this.rows.value.length; index++) {
      let s = this.rows.value[index]['Level_values'].split(',').length;
      if (s in count) {
        let temp = count[s];
        temp = temp + 1;
        count[s] = temp;
      } else {
        count[s] = 1;
      }
    }
    console.log('count dic is :');
    console.log(count);
    let str = '';
    for (let key in count) {
      str += key;
      str = str + '^' + String(count[key]);
      str += ' ';
    }
    str = str.slice(0, str.length - 1);

    for (let index = 0; index < this.rows.value.length; index++) {
     let temp=this.rows.value[index]['Factor_name']
     this.onscreen.push(temp)
     this.map_col[this.displayedColumns[index]]=this.onscreen[index]
    }
    console.log("onscreen:"+this.map_col)
    this.http
      .post('http://127.0.0.1:8000/', {
        pattern: str,
      })
      .subscribe((data) => (this.obj = data));
    console.log(this.obj);
    if (this.obj) {
      this.Gen_flag = true;
    }

    const s = this.obj.result;
    console.log(s);
    let list = s.split('\n');
    console.log(list);
    console.log(this.displayedColumns);
    const runs = list.length;
    for (let index = 0; index < runs; index++) {
      let d = {};
      for (let j = 0; j < list[index].length; j++) {
        d[String(j)] =
          this.rows.value[j]['Level_values'].split(',')[list[index][j]];
      }
      this.data.push(d);
    }
    console.log(this.data);
  }
  onAddRow() {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      Factor_name: null,
      Level_values: null,
    });
  }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
