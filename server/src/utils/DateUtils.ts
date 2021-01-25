class DateUtils{
    handleDate(date:string) {
          let formattedDate = date.split("T");
            
            if (formattedDate.length) {
                formattedDate = formattedDate[0].split("-");
              date = `${formattedDate[2]}/${formattedDate[1]}/${formattedDate[0]}`;
            }
          
          return date;
    }
}

export default new DateUtils();