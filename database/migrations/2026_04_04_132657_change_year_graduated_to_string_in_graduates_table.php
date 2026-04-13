<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('graduates', function (Blueprint $table) {
            $table->string('year_graduated')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('graduates', function (Blueprint $table) {
            $table->integer('year_graduated')->nullable()->change();
        });
    }
};