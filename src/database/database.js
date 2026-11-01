import { app } from "electron";
import path from 'node:path';
import Database from "better-sqlite3";



class AppDataBase{
    constructor(){ 
        const dataPath = path.join(app.getPath('userData'), 'Journalapp.sqlite'); // set the database location and name
        this.Jrecordbase = new Database(dataPath); // create new object
        this.Jrecordbase.pragma('journal_mode = WAL'); // follow the installation documentation for performance
        this.SetupDatabase(); // create the table when initialize
    }

    SetupDatabase(){

        //create table when there is none use exec to task that only do once for long time
        this.Jrecordbase.exec(`CREATE TABLE IF NOT EXISTS 
            Records(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            EventDate TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
            Particulars TEXT NOT NULL,
            Attendants TEXT, 
            SpecialRemark TEXT,
            imgpath TEXT
            )`) 
        console.log("Database table created")
        };




    closeDatabase(){
        this.Jrecordbase.close();
        console.log("database close")};


    NewRecord(date,particulars,attendants,specialremark,imagepath){
        //use prepare for sql statemetn that will use multiple times and execute with run,  @xxxx is for matching the variable input with function and the statment placeholders
        const stmt = this.Jrecordbase.prepare('INSERT INTO Records(EventDate,Particulars,Attendants,SpecialRemark,imgpath) VALUES (@date,@particulars,@attendants,@specialremark,@imagepath)');
        const info = stmt.run({date,particulars,attendants,specialremark,imagepath});

        return {
            id: info.lastInsertRowid,
            EventDate: date,
            Particulars: particulars,
            Attendants: attendants,
            SpecialRemark: specialremark,
            imgpath: imagepath
        }
    }

    GetAllRecords(){
        const stmt = this.Jrecordbase.prepare(`SELECT *, REPLACE(EventDate, 'T', ' ') AS DisDate
            FROM Records 
            ORDER BY date(EventDate) DESC, time(EventDate) ASC`); 
            // replace(column, word, with)** must use '' not ""
            // date(column) mean extract date info from column, the date must included and formated in text YYYY-MM-DD
            // time(column) mean extract time info from column, the time must included and formated in text HH:MM
            // orderby separate ordering because desc will cause night first then morning and asc will cause oldest record first latest last
        const temprecords = stmt.all();
        return temprecords;
    }

    DeleteRecord(id){
        const stmt = this.Jrecordbase.prepare('DELETE FROM Records WHERE id = ?');
        const info = stmt.run(id)

        return info.changes > 0;
    }

    Deleteimg(id){ // use along with the DeleteRecord() to delete image file, this one only use to select single record according to id
        return this.Jrecordbase.prepare('SELECT * FROM Records WHERE id = ?').get(id);
    }

    UpdateRecord(id,date,particulars,attendants,specialremark,imagepath){ // update everything according to id selected
        const stmt = this.Jrecordbase.prepare('UPDATE Records SET EventDate = :date, Attendants = :attendants, Particulars = :particulars,SpecialRemark = :specialremark, imgpath = :imagepath WHERE id = :id');
        const info = stmt.run({id,date,particulars,attendants,specialremark,imagepath});
        return info.changes > 0;
    }

    UpdataWithoutImg({id,date,particulars,attendants,specialremark}){// no update imgpath 
        const stmt = this.Jrecordbase.prepare('UPDATE Records SET EventDate = :date, Attendants = :attendants, Particulars = :particulars,SpecialRemark = :specialremark WHERE id = :id');
        const info = stmt.run({id,date,particulars,attendants,specialremark});
        return info.changes > 0;
    }

    HomepageYearload(){//for homepage to check whether there is record at each year. it only return each year one times only as data 
        const stmt = this.Jrecordbase.prepare("SELECT DISTINCT strftime('%Y', EventDate) AS year FROM Records ORDER BY year DESC");
        const yearrecord = stmt.all(); //strftime(%Y, column) mean extract and make text of year at the column must formated YYYY-MM-DD, Y is YYYY- number, y is YY- number only

        return yearrecord;
    }
   
    LoadrecordbyYear(year){// load the data according to the year
        const stmt = this.Jrecordbase.prepare("SELECT *, REPLACE(EventDate, 'T', ' ') AS DisDate FROM Records WHERE EventDate LIKE ? ORDER BY DisDate DESC");
        const yearrecord = stmt.all(`${year}%`); //LIKE is use to check for similiar value in the column. LIKE need to pair with % to ensure the order of the word, if ${20}% then 2026,20sda will also count
        // basically it is saying select all the record  WHERE the value of EventDate column that have ${variable} pattern of value in front of it FROM table Records 
        // and replace the T word with "" and put the data to new column named DisDate 
        return yearrecord;

    }

    SearchwithCriteria(criteria){ // search and form a table using criteria
        let sql = "SELECT *, REPLACE(EventDate,'T',' ') AS DisDate FROM Records WHERE 1=1"; // sql statement that allow extention
        // need to use SELECT * to make sure every data column is generate. if not the REPLACE will simply create extra column AS DisDate and the EventDate is not include in the result table 
        const value = [];// store the criteria value

        if(criteria.startDate){ // check each input exist
            sql += ' AND EventDate >=?'; // then extend the sql statement
            value.push(criteria.startDate); // store the value needed for later assign to the "?" according to order
           

        }
        if(criteria.endDate){
            sql += ' AND EventDate <=?';
            value.push(criteria.endDate);
            
        }   
        if(criteria.Attendants){
            sql += ' AND Attendants LIKE ?';
            value.push(`%${criteria.Attendants}%`);
            
            
        }   
        if(criteria.Particulars){
            sql += ' AND Particulars LIKE ?';
            value.push(`%${criteria.Particulars}%`);
            
        }   
        if(criteria.SpecialRemark){
            sql += ' AND SpecialRemark LIKE ?';
            value.push(`%${criteria.SpecialRemark}%`);
        }
        if(criteria.ForPrint === true){ // custom flag for finally arrange according to date
             sql += ' ORDER BY DisDate ASC';
        }else{sql += ' ORDER BY DisDate DESC';}  


        const stmt = this.Jrecordbase.prepare(sql); // prepare sql statement for run
        const result = stmt.all(...value)// execute the statement (...) mean unpack the array into text according to order
        return result ; // return the result table 

    }

}

export default AppDataBase ;