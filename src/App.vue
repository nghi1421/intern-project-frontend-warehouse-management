<script>
import Table from "./components/table/Table.vue";

export default {
  components: {
    Table,
  },

  data() {
    return {
      columns: [
        {
          key: "id",
          value: "User ID",
          sortable: true,
        },
        {
          key: "firstName",
          value: "Firstname",
          sortable: true,
        },
        {
          key: "lastName",
          value: "Lastname",
          sortable: true,
        },
        {
          key: "emailAddress",
          value: "Email",
          sortable: true,
        },
        {
          key: "gender",
          value: "Gender",
          sortable: true,
        },
        {
          key: "phoneNumber",
          value: "Phone",
          sortable: true,
        },
      ],
      users: [
        {
          id: 1,
          firstName: "Cort",
          lastName: "Tosh",
          emailAddress: "ctosh0@github.com",
          gender: "Male",
          phoneNumber: "327-626-5542",
        },
        {
          id: 2,
          firstName: "Brianne",
          lastName: "Dzeniskevich",
          emailAddress: "bdzeniskevich1@hostgator.com",
          gender: "Female",
          phoneNumber: "144-190-8956",
        },
        {
          id: 3,
          firstName: "Isadore",
          lastName: "Botler",
          emailAddress: "ibotler2@gmpg.org",
          gender: "Male",
          phoneNumber: "350-937-0792",
        },
        {
          id: 4,
          firstName: "Janaya",
          lastName: "Klosges",
          emailAddress: "jklosges3@amazon.de",
          gender: "Female",
          phoneNumber: "502-438-7799",
        },
        {
          id: 5,
          firstName: "Freddi",
          lastName: "Di Claudio",
          emailAddress: "fdiclaudio4@phoca.cz",
          gender: "Female",
          phoneNumber: "265-448-9627",
        },
        {
          id: 6,
          firstName: "Oliy",
          lastName: "Mairs",
          emailAddress: "omairs5@fda.gov",
          gender: "Female",
          phoneNumber: "221-516-2295",
        },
        {
          id: 7,
          firstName: "Tabb",
          lastName: "Wiseman",
          emailAddress: "twiseman6@friendfeed.com",
          gender: "Male",
          phoneNumber: "171-817-5020",
        },
        {
          id: 8,
          firstName: "Joela",
          lastName: "Betteriss",
          emailAddress: "jbetteriss7@msu.edu",
          gender: "Female",
          phoneNumber: "481-100-9345",
        },
        {
          id: 9,
          firstName: "Alistair",
          lastName: "Vasyagin",
          emailAddress: "avasyagin8@gnu.org",
          gender: "Male",
          phoneNumber: "520-669-8364",
        },
        {
          id: 10,
          firstName: "Nealon",
          lastName: "Ratray",
          emailAddress: "nratray9@typepad.com",
          gender: "Male",
          phoneNumber: "993-654-9793",
        },
        {
          id: 11,
          firstName: "Annissa",
          lastName: "Kissick",
          emailAddress: "akissicka@deliciousdays.com",
          gender: "Female",
          phoneNumber: "283-425-2705",
        },
        {
          id: 12,
          firstName: "Nissie",
          lastName: "Sidnell",
          emailAddress: "nsidnellb@freewebs.com",
          gender: "Female",
          phoneNumber: "754-391-3116",
        },
        {
          id: 13,
          firstName: "Madalena",
          lastName: "Fouch",
          emailAddress: "mfouchc@mozilla.org",
          gender: "Female",
          phoneNumber: "584-300-9004",
        },
        {
          id: 14,
          firstName: "Rozina",
          lastName: "Atkins",
          emailAddress: "ratkinsd@japanpost.jp",
          gender: "Female",
          phoneNumber: "792-856-0845",
        },
        {
          id: 15,
          firstName: "Lorelle",
          lastName: "Sandcroft",
          emailAddress: "lsandcrofte@google.nl",
          gender: "Female",
          phoneNumber: "882-911-7241",
        },
      ],
    };
  },
};
</script>
<template>
  <div class="w-full">
    <Table :columns="columns" :rows="users"></Table>
  </div>
</template>
